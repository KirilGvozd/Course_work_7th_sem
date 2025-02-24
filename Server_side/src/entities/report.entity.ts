import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.entity";
import {Item} from "./item.entity";

@Entity()
export class Report {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    moderatorId: number;

    @Column()
    reporterId: number;

    @Column()
    suspectId: number;

    @Column({ nullable: true })
    itemId?: number;

    @Column()
    message: string;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'moderatorId' })
    moderator: User;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'reporterId' })
    reporter: User;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'suspectId' })
    suspect: User;

    @ManyToOne(() => Item, (item) => item.id)
    @JoinColumn({ name: "itemId" })
    item: Item;
}