import { User } from "./user.entity";
import { Item } from "./item.entity";
export declare class Chat {
    id: number;
    itemId: number;
    senderId: number;
    receiverId: number;
    messageText: string;
    messageDate: string;
    item: Item;
    sender: User;
    receiver: User;
}
