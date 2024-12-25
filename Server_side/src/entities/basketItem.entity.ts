import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Item} from "./item.entity";
import {User} from "./user.entity";

@Entity('basketItem')
export class BasketItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    itemId: number;

    @Column()
    userId: number;

    @ManyToOne(() => Item, (item) => item.id)
    @JoinColumn({name: 'itemId'})
    item: Item;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({name: 'userId'})
    user: User;
}