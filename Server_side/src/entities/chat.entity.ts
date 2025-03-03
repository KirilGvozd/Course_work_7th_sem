import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.entity";
import {Item} from "./item.entity";

@Entity('chat')
export class Chat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    itemId: number;

    @Column()
    senderId: number;

    @Column()
    receiverId: number;

    @Column()
    messageText: string;

    @Column()
    messageDate: string;

    @ManyToOne(() => Item, (item) => item.id, { onDelete: 'CASCADE' })
    @JoinColumn({name: 'itemId'})
    item: Item;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({name: 'senderId'})
    sender: User;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({name: 'receiverId'})
    receiver: User;
}