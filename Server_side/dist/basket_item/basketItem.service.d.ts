import { Repository } from "typeorm";
import { BasketItem } from "../entities/basketItem.entity";
import { CreateBasketItemDto } from "./dto/createBasketItemDto";
import { PaginationDto } from "../pagination.dto";
export declare class BasketItemService {
    private itemRepo;
    constructor(itemRepo: Repository<BasketItem>);
    findAll(paginationDto: PaginationDto, userId: number): Promise<BasketItem[]>;
    create(body: CreateBasketItemDto): Promise<void>;
    delete(id: number, userId: number): Promise<void>;
}
