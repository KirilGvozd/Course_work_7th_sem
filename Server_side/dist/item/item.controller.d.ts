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
    retrieveWishlist(req: any): Promise<[import("../entities/wishlist.entity").Wishlist[], number]>;
    findOne(id: number): Promise<import("../entities/item.entity").Item>;
    create(body: CreateItemDto, request: any, files: Express.Multer.File[]): Promise<CreateItemDto & import("../entities/item.entity").Item>;
    addToWishlist(req: any, body: {
        itemName: string;
        userId: number;
    }): Promise<{
        itemName: string;
        userId: number;
    } & import("../entities/wishlist.entity").Wishlist>;
    reserve(itemId: number, req: any): Promise<import("../entities/item.entity").Item>;
    deleteReservation(itemId: number, req: any): Promise<import("../entities/item.entity").Item>;
    approveReservation(itemId: number, req: any): Promise<import("typeorm").DeleteResult>;
    rejectReservation(itemId: number, req: any): Promise<import("../entities/item.entity").Item>;
    update(id: number, body: UpdateItemDto, files: Express.Multer.File[], request: any): Promise<{
        prices: number[];
        images: string[];
        categoryId: number;
        deletedImages?: string[];
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
    removeFromWishlist(id: number, req: any): Promise<import("typeorm").DeleteResult>;
    delete(id: number, request: any): Promise<import("typeorm").DeleteResult>;
}
