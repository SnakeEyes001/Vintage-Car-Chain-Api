import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  birthDay: string;

  @Column()
  adress: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  password: string;
}
