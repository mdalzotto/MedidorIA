import { Request, Response } from 'express';
import { gemini } from '../services/GeminiService';
import { confirmationValidatorSchema, uploadValidatorSchema } from '../validator/reading';
import { ReadingRepository } from '../repositories/ReadingRepository';
import {Reading} from "../models/Reading";

const readingRepository = new ReadingRepository();

const generateErrorResponse = (code: string, description: string) => ({
  error_code: code,
  error_description: description,
});

const validateUpload = async (data: any) => {
  const { error } = uploadValidatorSchema.validate(data);
  return error ? generateErrorResponse('INVALID_DATA', error.details.map(d => d.message).join('; ')) : null;
};

const validateConfirmation = async (data: any) => {
  const { error } = confirmationValidatorSchema.validate(data);
  return error ? generateErrorResponse('INVALID_DATA', error.details.map(d => d.message).join('; ')) : null;
};

const formatReadingResponse = (reading: any) => ({
  measure_uuid: reading.uuid,
  measure_datetime: reading.measure_datetime,
  measure_type: reading.measure_type,
  has_confirmed: reading.confirmed,
  image_url: `http://localhost/imagem/${reading.uuid}`,
});

export const upload = async (req: Request, res: Response) => {
  const { image, customer_code, measure_datetime, measure_type } = req.body;
  const imageData = image.replace(/^data:image\/[^;]+;base64,/, '');

  const validationError = await validateUpload({ ...req.body, image: imageData });
  if (validationError) {
    return res.status(400).json(validationError);
  }

  const existingReading = await readingRepository.findExistingReading(measure_type, customer_code, new Date(measure_datetime));
  if (existingReading) {
    return res.status(409).json(generateErrorResponse('DOUBLE_REPORT', 'Leitura do mês já realizada'));
  }

  try {
    const prompt = `What is the ${measure_type.toLowerCase()} meter reading in this photo?`;
    const response = await gemini(prompt, imageData);
    const value = Number(response.replace(/\D/g, ''));

    const reading = new Reading(); // Use a instância da entidade Reading
    reading.customer_code = customer_code;
    reading.measure_datetime = new Date(measure_datetime);
    reading.measure_type = measure_type;
    reading.value = value;

    await readingRepository.save(reading);
    return res.status(200).json({
      image_url: `http://localhost/imagem/${reading.uuid}`,
      measure_value: reading.value,
      measure_uuid: reading.uuid,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error processing the image');
  }
};

export const confirma = async (req: Request, res: Response) => {
  const { measure_uuid, confirmed_value } = req.body;

  const validationError = await validateConfirmation(req.body);
  if (validationError) {
    return res.status(400).json(validationError);
  }

  const reading = await readingRepository.findById(measure_uuid);
  if (!reading) {
    return res.status(404).json(generateErrorResponse('MEASURE_NOT_FOUND', 'Leitura não encontrada'));
  }

  if (reading.confirmed) {
    return res.status(409).json(generateErrorResponse('CONFIRMATION_DUPLICATE', 'Leitura já confirmada'));
  }

  reading.confirmed = reading.value === confirmed_value;
  await readingRepository.save(reading);

  return res.status(200).json({ success: reading.confirmed });
};

export const listar = async (req: Request, res: Response) => {
  const { customer_code } = req.params;
  const { measure_type } = req.query;

  const conditions: any = { customer_code };

  if (measure_type && typeof measure_type === 'string' && measure_type.trim() !== '') {
    const upperType = measure_type.toUpperCase();
    if (!['WATER', 'GAS'].includes(upperType)) {
      return res.status(400).json(generateErrorResponse('INVALID_TYPE', 'Tipo de medição não permitida'));
    }
    conditions.measure_type = upperType;
  }

  try {
    const readings = await readingRepository.find(conditions);

    if (readings.length === 0) {
      return res.status(404).json(generateErrorResponse('MEASURES_NOT_FOUND', 'Nenhuma leitura encontrada'));
    }

    const responseData = readings.map(formatReadingResponse);
    return res.status(200).json({ customer_code, measures: responseData });
  } catch (error) {
    console.error(error);
    return res.status(500).json('Erro ao recuperar leituras');
  }
};
