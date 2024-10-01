import { Reading } from '../models/Reading';
import { DB } from '../config/database';
import { Between } from 'typeorm';

export class ReadingRepository {
    private repository = DB.getRepository(Reading);

    async findExistingReading(measure_type: 'WATER' | 'GAS', customer_code: string, measure_datetime: Date) {
        const year = measure_datetime.getFullYear();
        const month = measure_datetime.getMonth() + 1;

        return await this.repository.findOne({
            where: {
                measure_type,
                customer_code,
                measure_datetime: Between(new Date(year, month - 1, 1), new Date(year, month, 0, 23, 59, 59, 999)),
            },
        });
    }

    async save(reading: Reading) {
        return await this.repository.save(reading);
    }

    async findById(uuid: string) {
        return await this.repository.findOne({ where: { uuid } });
    }

    async find(conditions: any) {
        return await this.repository.find({ where: conditions });
    }
}
