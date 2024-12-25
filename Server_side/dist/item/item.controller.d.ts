import { ItemService } from "./item.service";
import { PaginationDto } from "../pagination.dto";
export declare class ItemController {
    private readonly itemService;
    constructor(itemService: ItemService);
    findAll(paginationDto: PaginationDto, typeId?: number, minPrice?: number, maxPrice?: number, sellerId?: number): Promise<{
        items: import("../entities/item.entity").Item[];
        total: number;
    }>;
    findOne(id: number): Promise<import("../entities/item.entity").Item>;
    create(body: any, request: any, files: Express.Multer.File[]): Promise<any>;
    update(id: number, body: any, request: any, files: Express.Multer.File[]): Promise<import("typeorm").UpdateResult>;
    delete(id: number, request: any): Promise<import("typeorm").DeleteResult>;
}
