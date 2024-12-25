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
        sellerName: string;
        id: number;
        userId: number;
        user: import("../entities/user.entity").User;
        typeId: number;
        type: import("../entities/type.entity").Type;
        prices: number[];
        images: string[];
        name: string;
        description: string;
        price: number;
        users: import("../entities/user.entity").User[];
    }>;
    create(body: any, request: any, files: Express.Multer.File[]): Promise<any>;
    update(id: number, body: any, request: any, files: Express.Multer.File[]): Promise<any>;
    delete(id: number, request: any): Promise<import("typeorm").DeleteResult>;
}
