import { Item } from "./item.entity";
export declare class User {
    id: number;
    email: string;
    role: string;
    password: string;
    name: string;
    rates: number[];
    removedRates: number[];
    rate: number;
    favourites: Item[];
    refreshToken: string;
    hashPassword(): Promise<void>;
}
