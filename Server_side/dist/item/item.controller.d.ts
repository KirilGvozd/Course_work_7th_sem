import { ItemService } from "./item.service";
import { PaginationDto } from "../pagination.dto";
import { CreateItemDto } from "./dto/createItemDto";
import { UpdateItemDto } from "./dto/updateItem.dto";
export declare class ItemController {
    private readonly itemService;
    constructor(itemService: ItemService);
    findAll(paginationDto: PaginationDto, typeId?: number, minPrice?: number, maxPrice?: number, sellerId?: number, attributes?: string): Promise<{
        items: import("../entities/item.entity").Item[];
        total: number;
    }>;
    getReservedItems(req: any): Promise<[import("../entities/item.entity").Item[], number]>;
    getItemsPendingApproval(req: any): Promise<import("../entities/item.entity").Item[]>;
    findOne(id: number): Promise<import("../entities/item.entity").Item>;
    create(body: CreateItemDto, request: any, files: Express.Multer.File[]): Promise<any>;
    reserve(itemId: number, req: any): Promise<import("../entities/item.entity").Item>;
    deleteReservation(itemId: number, req: any): Promise<import("../entities/item.entity").Item>;
    approveReservation(itemId: number, req: any): Promise<import("typeorm").DeleteResult>;
    rejectReservation(itemId: number, req: any): Promise<import("../entities/item.entity").Item>;
    update(id: number, body: UpdateItemDto, files: Express.Multer.File[], request: any): Promise<{
        prices: number[];
        categoryId: number;
        images: string[];
        name: string;
        description: string;
        price: number;
        id: number;
        userId: number;
        user: import("../entities/user.entity").User;
        reservedById?: number;
        reservedBy?: import("../entities/user.entity").User;
        reservationExpiry?: Date;
        isApprovedByModerator: boolean;
        users: import("../entities/user.entity").User[];
        category: import("../entities/category.entity").Category;
        attributes: import("../entities/itemAttribute.entity").ItemAttribute[];
    }>;
    delete(id: number, request: any): Promise<import("typeorm").DeleteResult>;
}
