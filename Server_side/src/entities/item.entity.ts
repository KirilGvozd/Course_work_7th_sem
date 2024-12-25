import {Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.entity";
import {Type} from "./type.entity";

@Entity()
export class Item {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({name: 'userId'})
    user: User;

    @Column()
    typeId: number;

    @ManyToOne(() => Type, (type) => type.id)
    @JoinColumn({name: 'typeId'})
    type: Type;

    @Column("int", { array: true} )
    prices: number[];

    @Column("text", {array: true} )
    images: string[];

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    price: number;

    @ManyToMany(() => User, (user) => user.favourites)
    users: User[];
}