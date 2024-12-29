import { ItemService } from "./item.service";
import { PaginationDto } from "../pagination.dto";
export declare class ItemController {
    private readonly itemService;
    constructor(itemService: ItemService);
    findAll(paginationDto: PaginationDto, typeId?: number, minPrice?: number, maxPrice?: number, sellerId?: number): Promise<{
        items: import("../entities/item.entity").Item[];
        total: number;
    }>;
    findOne(id: number): Promise<{
        result: import("../entities/item.entity").Item;
        sellerName: string;
    }>;
    create(body: any, request: any, files: Express.Multer.File[]): Promise<any>;
    update(id: number, body: any, files: Express.Multer.File[], request: any): Promise<any>;
    delete(id: number, request: any): Promise<import("typeorm").DeleteResult>;
}
