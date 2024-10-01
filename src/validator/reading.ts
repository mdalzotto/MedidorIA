import Joi from 'joi';

export const uploadValidatorSchema = Joi.object({
    image: Joi.string().base64().required().messages({
        'string.base64': 'A imagem deve estar em formato base64.',
        'any.required': 'O campo "image" é obrigatório.',
        'string.empty': 'A imagem não pode ser vazio.',
    }),
    customer_code: Joi.string().required().messages({
        'string.empty': 'O código do cliente não pode ser vazio.',
        'any.required': 'O campo "customer_code" é obrigatório.',
    }),
    measure_datetime: Joi.date().iso().required().messages({
        'date.base': 'A data da medição deve ser uma data válida.',
        'date.iso': 'A data da medição deve estar no formato ISO.',
        'any.required': 'O campo "measure_datetime" é obrigatório.',
    }),
    measure_type: Joi.string().valid('WATER', 'GAS').required().messages({
        'any.only': 'O tipo de medição deve ser "WATER" ou "GAS".',
        'any.required': 'O campo "measure_type" é obrigatório.',
    }),
});


export const confirmationValidatorSchema = Joi.object({
    measure_uuid: Joi.string().trim().min(1).required().messages({
            'string.empty': 'O UUID da medição não pode ser vazio.',
            'string.min': 'O UUID da medição deve ter pelo menos 1 caractere.',
            'any.required': 'O campo "measure_uuid" é obrigatório.',
        }),
    confirmed_value: Joi.number().integer().required().messages({
            'number.base': 'O valor confirmado deve ser um número.',
            'number.integer': 'O valor confirmado deve ser um número inteiro.',
            'any.required': 'O campo "confirmed_value" é obrigatório.',
        }),
});