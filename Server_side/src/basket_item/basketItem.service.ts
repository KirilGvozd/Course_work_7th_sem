import {Injectable, UnauthorizedException} from "@nestjs/common";
import {Repository} from "typeorm";
import {BasketItem} from "../entities/basketItem.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {CreateBasketItemDto} from "./dto/createBasketItemDto";
import {PaginationDto} from "../pagination.dto";
import {DEFAULT_PAGE_SIZE} from "../utils/constants";

@Injectable()
export class BasketItemService {
    constructor(
        @InjectRepository(BasketItem)
        private itemRepo: Repository<BasketItem>
    ) {}

    async findAll(paginationDto: PaginationDto, userId: number) {
        return await this.itemRepo.find({
            skip: paginationDto.skip,
            take: paginationDto.limit ?? DEFAULT_PAGE_SIZE,
            where: {
                userId: userId,
            },
        });
    }

    async create(body: CreateBasketItemDto) {
        await this.itemRepo.save(body);
    }

    async delete(id: number, userId: number) {
        const basketItem = await this.itemRepo.findOne({
            where: {
                userId: userId,
            }
        });

        if (!basketItem) {
            throw new UnauthorizedException("You don't have access to this cart!");
        }
        await this.itemRepo.delete(id);
    }
}