import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Reading extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  customer_code: string;

  @Column()
  measure_datetime: Date;

  @Column()
  measure_type: 'WATER' | 'GAS';

  @Column()
  value: number;

  @Column({ default: false })
  confirmed: boolean;
}
