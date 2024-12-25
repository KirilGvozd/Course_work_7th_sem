import { User } from "./user.entity";
export declare class Comment {
    id: number;
    userId: number;
    user: User;
    sellerId: number;
    seller: User;
    attachments: string[];
    date: string;
    text: string;
    rate: number;
}
