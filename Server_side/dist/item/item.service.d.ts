import { Repository } from "typeorm";
import { Item } from "../entities/item.entity";
import { PaginationDto } from "../pagination.dto";
export declare class ItemService {
    private itemRepo;
    constructor(itemRepo: Repository<Item>);
    findAll(paginationDto: PaginationDto, filters: {
        typeId?: number;
        minPrice?: number;
        maxPrice?: number;
        sellerId?: number;
    }): Promise<{
        items: Item[];
        total: number;
    }>;
    findOne(id: number): Promise<Item>;
    create(body: any, user: {
        userId: number;
        role: string;
    }): Promise<any>;
    update(id: number, body: any): Promise<import("typeorm").UpdateResult>;
    delete(id: number, userId: number): Promise<import("typeorm").DeleteResult>;
}
