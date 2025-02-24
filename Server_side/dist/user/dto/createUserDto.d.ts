import { Item } from "../../entities/item.entity";
export declare class CreateUserDto {
    email: string;
    role: string;
    password: string;
    name: string;
    rate: number;
    favourites: Item[];
    rates: number[];
    removedRates: number[];
}
