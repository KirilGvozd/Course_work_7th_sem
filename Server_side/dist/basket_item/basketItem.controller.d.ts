import { BasketItemService } from "./basketItem.service";
import { CreateBasketItemDto } from "./dto/createBasketItemDto";
import { PaginationDto } from "../pagination.dto";
export declare class BasketItemController {
    private readonly basketItemService;
    constructor(basketItemService: BasketItemService);
    findAll(paginationDto: PaginationDto, request: any): Promise<import("../entities/basketItem.entity").BasketItem[]>;
    create(body: CreateBasketItemDto, request: any): Promise<void>;
    delete(id: number, request: any): Promise<void>;
}
