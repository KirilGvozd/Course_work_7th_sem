import { Item } from "./item.entity";
import { User } from "./user.entity";
export declare class BasketItem {
    id: number;
    itemId: number;
    userId: number;
    item: Item;
    user: User;
}
