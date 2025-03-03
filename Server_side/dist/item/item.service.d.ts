import { Repository } from "typeorm";
import { Item } from "../entities/item.entity";
import { PaginationDto } from "../pagination.dto";
import { MailService } from "../mail/mail.service";
import { User } from "../entities/user.entity";
import { UpdateItemDto } from "./dto/updateItem.dto";
import { Wishlist } from "../entities/wishlist.entity";
import { CreateItemDto } from "./dto/createItemDto";
export declare class ItemService {
    private itemRepository;
    private readonly mailService;
    private userRepository;
    private wishlistRepository;
    constructor(itemRepository: Repository<Item>, mailService: MailService, userRepository: Repository<User>, wishlistRepository: Repository<Wishlist>);
    findAll(paginationDto: PaginationDto, filters: {
        categoryId?: number;
        minPrice?: number;
        maxPrice?: number;
        sellerId?: number;
        attributes?: Record<string, any>;
    }): Promise<{
        items: Item[];
        total: number;
    }>;
    findOne(id: number): Promise<Item>;
    create(body: CreateItemDto, user: {
        userId: number;
        role: string;
    }): Promise<CreateItemDto & Item>;
    reserveItem(itemId: number, userId: number): Promise<Item>;
    removeReservation(itemId: number, userId: number): Promise<Item>;
    approveReservation(itemId: number, sellerId: number): Promise<import("typeorm").DeleteResult>;
    rejectReservation(itemId: number, sellerId: number): Promise<Item>;
    getReservedItems(userId: number): Promise<[Item[], number]>;
    getItemsPendingApproval(userId: number): Promise<Item[]>;
    update(id: number, body: UpdateItemDto, userId: number): Promise<{
        prices: number[];
        images: string[];
        categoryId: number;
        deletedImages?: string[];
        name: string;
        description: string;
        price: number;
        id: number;
        userId: number;
        user: User;
        reservedById?: number;
        reservedBy?: User;
        reservationExpiry?: Date;
        isApprovedByModerator: boolean;
        users: User[];
        category: import("../entities/category.entity").Category;
        attributes: import("../entities/itemAttribute.entity").ItemAttribute[];
    }>;
    delete(id: number, userId: number): Promise<import("typeorm").DeleteResult>;
    retrieveExistingImages(id: number): Promise<string[]>;
    addItemToWishlist(itemName: string, userId: number): Promise<{
        itemName: string;
        userId: number;
    } & Wishlist>;
    retrieveWishlist(id: number): Promise<[Wishlist[], number]>;
    deleteFromWishlist(id: number, userId: number): Promise<import("typeorm").DeleteResult>;
}
