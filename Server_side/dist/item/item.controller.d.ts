import { ItemService } from "./item.service";
import { PaginationDto } from "../pagination.dto";
import { CreateItemDto } from "./dto/createItemDto";
import { UpdateItemDto } from "./dto/updateItem.dto";
export declare class ItemController {
    private readonly itemService;
    constructor(itemService: ItemService);
    findAll(paginationDto: PaginationDto, typeId?: number, minPrice?: number, maxPrice?: number, sellerId?: number): Promise<{
        items: import("../entities/item.entity").Item[];
        total: number;
    }>;
    findOne(id: number): Promise<import("../entities/item.entity").Item>;
    create(body: CreateItemDto, request: any, files: Express.Multer.File[]): Promise<any>;
    update(id: number, body: UpdateItemDto, files: Express.Multer.File[], request: any): Promise<{
        prices: number[];
        images: string[];
        name: string;
        description: string;
        price: number;
        id: number;
        userId: number;
        user: import("../entities/user.entity").User;
        users: import("../entities/user.entity").User[];
        category: import("../entities/category.entity").Category;
        categoryId: number;
        attributes: import("../entities/itemAttribute.entity").ItemAttribute[];
    }>;
    delete(id: number, request: any): Promise<import("typeorm").DeleteResult>;
}
