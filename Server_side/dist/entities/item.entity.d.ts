import { User } from "./user.entity";
import { Category } from "./category.entity";
import { ItemAttribute } from "./itemAttribute.entity";
export declare class Item {
    id: number;
    userId: number;
    user: User;
    reservedById?: number;
    reservedBy?: User;
    reservationExpiry?: Date;
    isApprovedByModerator: boolean;
    prices: number[];
    images: string[];
    name: string;
    description: string;
    price: number;
    users: User[];
    category: Category;
    categoryId: number;
    attributes: ItemAttribute[];
}
