import { Item } from "./item.entity";
import { Wishlist } from "./wishlist.entity";
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
    wishlists: Wishlist[];
    twoFactorSecret: string;
    isTwoFactorEnabled: boolean;
    twoFactorRecoveryCodes: string;
}
