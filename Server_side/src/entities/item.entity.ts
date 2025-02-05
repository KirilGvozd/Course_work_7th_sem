import {Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.entity";
import {Category} from "./category.entity";
import {ItemAttribute} from "./itemAttribute.entity";

@Entity()
export class Item {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @ManyToOne(() => User, (user) => user.id, {onDelete: "CASCADE"})
    @JoinColumn({name: 'userId'})
    user: User;

    @Column("money", { array: true} )
    prices: number[];

    @Column("text", {array: true} )
    images: string[];

    @Column()
    name: string;

    @Column()
    description: string;

    @Column("money")
    price: number;

    @ManyToMany(() => User, (user) => user.favourites, {onDelete: "CASCADE"})
    users: User[];

    @ManyToOne(() => Category, {onDelete: "CASCADE"})
    @JoinColumn({ name: "categoryId" })
    category: Category;

    @Column()
    categoryId: number;

    @OneToMany(() => ItemAttribute, itemAttr => itemAttr.item, {onDelete: "CASCADE"})
    attributes: ItemAttribute[];
}