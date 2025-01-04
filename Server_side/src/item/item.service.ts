import {Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {Repository} from "typeorm";
import {Item} from "../entities/item.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {CreateItemDto} from "./dto/createItemDto";
import {PaginationDto} from "../pagination.dto";
import {DEFAULT_PAGE_SIZE} from "../utils/constants";
import {UpdateItemDto} from "./dto/updateItem.dto";
import {MailService} from "../mail/mail.service";
import {User} from "../entities/user.entity";

@Injectable()
export class ItemService {
    constructor(
        @InjectRepository(Item)
        private itemRepo: Repository<Item>,
        private readonly mailService: MailService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async findAll(paginationDto: PaginationDto, filters: { typeId?: number, minPrice?: number, maxPrice?: number, sellerId?: number }) {
        const query = this.itemRepo.createQueryBuilder("item");

        if (filters.sellerId) {
            query.andWhere("item.userId = :sellerId", { sellerId: filters.sellerId });
        }

        if (filters.typeId) {
            query.andWhere("item.typeId = :typeId", { typeId: filters.typeId });
        }

        if (filters.minPrice) {
            query.andWhere("item.price >= :minPrice", { minPrice: filters.minPrice });
        }

        if (filters.maxPrice) {
            query.andWhere("item.price <= :maxPrice", { maxPrice: filters.maxPrice });
        }

        query.skip(paginationDto.skip).take(paginationDto.limit ?? DEFAULT_PAGE_SIZE);

        const [items, total] = await query.getManyAndCount();
        return { items, total };
    }


    async findOne(id: number) {
        const result = await this.itemRepo.findOne({
            where: {
                id
            },
            relations: ['user'],
        });

        if (!result) {
            throw new NotFoundException("Not Found");
        }

        return result;
    }

    async create(body: any, user: {userId: number, role: string}) {
        if (user.role === "buyer") {
            throw new UnauthorizedException("You dont have permission to create an item!");
        }

        return await this.itemRepo.save(body);
    }

    async update(id: number, body: any) {
        const item = await this.itemRepo.findOne({
            where: { id },
        });

        if (!item) {
            throw new NotFoundException("Item not found.");
        }

        if (item.userId !== body.userId) {
            throw new UnauthorizedException("You don't have the permission to update this item!");
        }

        const previousPrice = item.prices.length > 0 ? item.prices[0] : item.price;

        if (body.price !== item.price) {
            item.prices.push(item.price);
        }

        const updatedItem = {
            ...item,
            ...body,
            prices: item.prices,
        };

        await this.itemRepo.save(updatedItem);

        if (body.price !== item.price) {
            const priceChange = body.price > item.price ? 'повышена' : 'понижена';

            const users = await this.userRepository.find({
                relations: ['favourites'],
            });

            const usersToNotify = users.filter((user) =>
                user.favourites.some((favourite) => favourite.id == id),
            );

            console.log(usersToNotify);

            // Отправляем уведомления этим пользователям
            for (const user of usersToNotify) {
                await this.mailService.sendPriceUpdateNotification(
                    user.email,
                    item.name,
                    previousPrice,
                    body.price,
                    priceChange,
                );
            }
        }

        return updatedItem;
    }

    async delete(id: number, userId: number){
        const item = await this.itemRepo.findOne({
            where: {
                userId: userId,
            }
        });

        if (!item) {
            throw new UnauthorizedException("You don't have the permission to delete this item!");
        }

        return await this.itemRepo.delete(id);
    }
}