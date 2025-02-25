import {
    BadRequestException,
    ConflictException, GoneException,
    Injectable,
    NotFoundException,
    UnauthorizedException
} from "@nestjs/common";
import {IsNull, Not, Repository} from "typeorm";
import {Item} from "../entities/item.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {PaginationDto} from "../pagination.dto";
import {DEFAULT_PAGE_SIZE} from "../utils/constants";
import {MailService} from "../mail/mail.service";
import {User} from "../entities/user.entity";
import {UpdateItemDto} from "./dto/updateItem.dto";

@Injectable()
export class ItemService {
    constructor(
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
        private readonly mailService: MailService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async findAll(
        paginationDto: PaginationDto,
        filters: {
            categoryId?: number,
            minPrice?: number,
            maxPrice?: number,
            sellerId?: number,
            attributes?: Record<string, any>
        }
    ) {
        const query = this.itemRepository.createQueryBuilder("item")
            .leftJoinAndSelect("item.attributes", "itemAttribute")
            .leftJoinAndSelect("itemAttribute.attribute", "attribute");

        if (filters.sellerId) {
            query.andWhere("item.userId = :sellerId", { sellerId: filters.sellerId });
        }

        if (filters.categoryId) {
            query.andWhere("item.categoryId = :categoryId", { categoryId: filters.categoryId });
        }

        if (filters.minPrice) {
            query.andWhere("item.price >= :minPrice", { minPrice: filters.minPrice });
        }

        if (filters.maxPrice) {
            query.andWhere("item.price <= :maxPrice", { maxPrice: filters.maxPrice });
        }

        if (filters.attributes) {
            Object.entries(filters.attributes).forEach(([key, value]) => {
                query.andWhere("attribute.name = :attrName", { attrName: key });

                if (typeof value === "number") {
                    // Точное совпадение для числовых атрибутов
                    query.andWhere("itemAttribute.numberValue = :exactValue", { exactValue: value });
                } else if (typeof value === "string") {
                    // Совпадение для строковых атрибутов
                    query.andWhere("itemAttribute.stringValue = :stringValue", { stringValue: value });
                } else if (typeof value === "boolean") {
                    // Совпадение для булевых атрибутов
                    query.andWhere("itemAttribute.booleanValue = :booleanValue", { booleanValue: value });
                }
            });
        }

        query.skip(paginationDto.skip).take(paginationDto.limit ?? DEFAULT_PAGE_SIZE);

        const [items, total] = await query.getManyAndCount();
        return { items, total };
    }


    async findOne(id: number) {
        const result = await this.itemRepository.findOne({
            where: {
                id
            },
            relations: ['user', 'attributes', 'category', 'attributes.attribute'],
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

        body.isApprovedByModerator = true;
        return await this.itemRepository.save(body);
    }

    async reserveItem(itemId: number, userId: number): Promise<Item> {
        const item = await this.itemRepository.findOne({
            where: { id: itemId },
            relations: ['user'],
        });

        const buyer = await this.userRepository.findOne({
            where: {
                id: userId,
            }
        });

        if (!buyer) {
            throw new NotFoundException("There's no such user!");
        }

        if (!item) {
            throw new NotFoundException('Item not found');
        }

        if (item.reservedById) {
            throw new ConflictException('Item already reserved');
        }

        item.reservedBy = buyer;
        item.reservationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await this.mailService.sendReservationOfItemNotification(item.user.email, item.name, buyer.name);
        return this.itemRepository.save(item);
    }

    async removeReservation(itemId: number, userId: number) {
        const item = await this.itemRepository.findOne({
            where: {
                id: itemId,
            },
            relations: ['user', 'reservedBy'],
        });

        if (!item) {
            throw new NotFoundException('Item not found');
        }

        if (userId !== item.reservedById) {
            throw new UnauthorizedException("You dont have permission to remove this reservation!");
        }

        await this.mailService.sendRemovalOfReservationNotification(item.user.email,
            item.name,
            item.user.name,
            item.reservedBy.name
        )

        item.reservedBy = null;
        item.reservationExpiry = null;
        return await this.itemRepository.save(item);
    }

    async approveReservation(itemId: number, sellerId: number) {
        const item = await this.itemRepository.findOne({
            where: {
                id: itemId,
            },
            relations: ['reservedBy'],
        });

        if (item.userId !== sellerId) {
            throw new UnauthorizedException("You dont have permission to approve this reservation!");
        }

        if (!item.reservedById) {
            throw new BadRequestException('Item is not reserved');
        }

        if (item.reservationExpiry < new Date()) {
            throw new GoneException('Reservation expired');
        }

        await this.mailService.sendApprovedReservationNotification(item.reservedBy.email, item.name, item.reservedBy.name)
        return await this.itemRepository.delete(itemId);
    }

    async rejectReservation(itemId: number, sellerId: number) {
        const item = await this.itemRepository.findOne({
            where: {
                id: itemId,
            },
            relations: ['reservedBy'],
        });

        if (!item) {
            throw new NotFoundException('Item not found');
        }

        if (item.userId !== sellerId) {
            throw new UnauthorizedException("You dont have permission to reject this reservation!");
        }

        await this.mailService.sendRejectReservationNotification(item.reservedBy.email, item.name, item.reservedBy.name)

        item.reservedBy = null;
        item.reservationExpiry = null;
        return this.itemRepository.save(item);
    }

    async getReservedItems(userId: number) {
        return await this.itemRepository.findAndCount({
            where: { reservedBy: { id: userId } },
            relations: ['user', 'category'],
        });
    }

    async getItemsPendingApproval(userId: number) {
        return this.itemRepository.find({
            where: {
                user: { id: userId },
                reservedById: Not(IsNull()),
            },
            relations: ['reservedBy', 'category'],
        });
    }

    async update(id: number, body: UpdateItemDto, userId: number) {
        const item = await this.itemRepository.findOne({
            where: { id },
        });

        if (!item) {
            throw new NotFoundException("Item not found.");
        }

        if (item.userId !== userId) {
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

        await this.itemRepository.save(updatedItem);

        if (body.price !== item.price) {
            const priceChange = body.price > item.price ? 'повышена' : 'понижена';

            const users = await this.userRepository.find({
                relations: ['favourites'],
            });

            const usersToNotify = users.filter((user) =>
                user.favourites.some((favourite) => favourite.id == id),
            );

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
        const item = await this.itemRepository.findOne({
            where: {
                userId: userId,
            }
        });

        if (!item) {
            throw new UnauthorizedException("You don't have the permission to delete this item!");
        }

        return await this.itemRepository.delete(id);
    }

    async retrieveExistingImages(id: number) {
        const item = await this.itemRepository.findOne({
            where: {
                id
            }
        });

        return item.images;
    }
}