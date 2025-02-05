import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Item} from "./item.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    role: string;

    @Column()
    password: string;

    @Column()
    name: string;

    @Column("int", { array: true })
    rates: number[];

    @Column("int", { array: true, nullable: true, default: {} })
    removedRates: number[];

    @Column("numeric", { precision: 5, scale: 2, default: 0 })
    rate: number;

    @ManyToMany(() => Item, (item) => item.users, { onDelete: "CASCADE" })
    @JoinTable()
    favourites: Item[];
}