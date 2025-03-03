import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.entity";

@Entity('wishlist')
export class Wishlist {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    itemName: string;

    @Column()
    userId: number;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: "userId" })
    user: User;
}