import { Repository } from "typeorm";
import { Item } from "../entities/item.entity";
import { PaginationDto } from "../pagination.dto";
import { MailService } from "../mail/mail.service";
import { User } from "../entities/user.entity";
import { UpdateItemDto } from "./dto/updateItem.dto";
export declare class ItemService {
    private itemRepo;
    private readonly mailService;
    private userRepository;
    constructor(itemRepo: Repository<Item>, mailService: MailService, userRepository: Repository<User>);
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
    update(id: number, body: UpdateItemDto, userId: number): Promise<{
        prices: number[];
        images: string[];
        name: string;
        description: string;
        price: number;
        id: number;
        userId: number;
        user: User;
        users: User[];
        category: import("../entities/category.entity").Category;
        categoryId: number;
        attributes: import("../entities/itemAttribute.entity").ItemAttribute[];
    }>;
    delete(id: number, userId: number): Promise<import("typeorm").DeleteResult>;
    retrieveExistingImages(id: number): Promise<string[]>;
}
