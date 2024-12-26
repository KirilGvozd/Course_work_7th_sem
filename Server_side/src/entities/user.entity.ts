import {BeforeInsert, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import * as bcrypt from "bcrypt";
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

    @Column()
    rate: number;

    @ManyToMany(() => Item, (item) => item.users)
    @JoinTable()
    favourites: Item[];

    @Column({ nullable: true })
    refreshToken: string;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}