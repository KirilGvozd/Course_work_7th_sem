import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('type')
export class Type {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}