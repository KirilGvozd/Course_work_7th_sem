import { User } from "./user.entity";
import { Type } from "./type.entity";
export declare class Item {
    id: number;
    userId: number;
    user: User;
    typeId: number;
    type: Type;
    prices: number[];
    images: string[];
    name: string;
    description: string;
    price: number;
    users: User[];
}
