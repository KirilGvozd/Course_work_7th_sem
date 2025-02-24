import {Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn} from "typeorm";
import {Item} from "./item.entity";
import {Attribute} from "./attribute.entity";

@Entity()
export class ItemAttribute {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Item, item => item.attributes, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'itemId' })
    item: Item;

    @Column({ nullable: false })
    itemId: number;

    @ManyToOne(() => Attribute, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'attributeId' })
    attribute: Attribute;

    @Column({ nullable: false })
    attributeId: number;

    @Column({ nullable: true })
    stringValue: string;

    @Column("numeric", { nullable: true, precision: 5, scale: 2 })
    numberValue: number;

    @Column({ nullable: true})
    booleanValue: boolean;
}