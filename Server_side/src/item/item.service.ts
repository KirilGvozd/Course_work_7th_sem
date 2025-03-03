import {
    BadRequestException,
    ConflictException, GoneException,
    Injectable,
    NotFoundException,
    UnauthorizedException
} from "@nestjs/common";
import {IsNull, MoreThan, Not, Repository} from "typeorm";
import {Item} from "../entities/item.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {PaginationDto} from "../pagination.dto";
import {DEFAULT_PAGE_SIZE} from "../utils/constants";
import {MailService} from "../mail/mail.service";
import {User} from "../entities/user.entity";
import {UpdateItemDto} from "./dto/updateItem.dto";
import {Wishlist} from "../entities/wishlist.entity";
import {CreateItemDto} from "./dto/createItemDto";

@Injectable()
export class ItemService {
    constructor(
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
        private readonly mailService: MailService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Wishlist)
        private wishlistRepository: Repository<Wishlist>,
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
        console.log(filters.attributes);
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
            Object.entries(filters.attributes).forEach(([key, value], index) => {
                // Создаем уникальные псевдонимы для каждого атрибута
                const attrAlias = `attr${index}`;
                const itemAttrAlias = `itemAttr${index}`;

                // Добавляем join для каждого атрибута
                query.leftJoinAndSelect(
                    "item.attributes",
                    itemAttrAlias,
                    `${itemAttrAlias}.itemId = item.id`
                );
                query.leftJoinAndSelect(
                    `${itemAttrAlias}.attribute`,
                    attrAlias,
                    `${attrAlias}.id = ${itemAttrAlias}.attributeId`
                );

                // Добавляем условие для каждого атрибута
                if (typeof value === "number") {
                    query.andWhere(`${attrAlias}.name = :attrName${index}`, { [`attrName${index}`]: key });
                    query.andWhere(`${itemAttrAlias}.numberValue = :exactValue${index}`, { [`exactValue${index}`]: value });
                } else if (typeof value === "string") {
                    query.andWhere(`${attrAlias}.name = :attrName${index}`, { [`attrName${index}`]: key });
                    query.andWhere(`${itemAttrAlias}.stringValue = :stringValue${index}`, { [`stringValue${index}`]: value });
                } else if (typeof value === "boolean") {
                    query.andWhere(`${attrAlias}.name = :attrName${index}`, { [`attrName${index}`]: key });
                    query.andWhere(`${itemAttrAlias}.booleanValue = :booleanValue${index}`, { [`booleanValue${index}`]: value });
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

    async create(body: CreateItemDto, user: { userId: number; role: string }) {
        if (user.role === 'buyer') {
            throw new UnauthorizedException('You dont have permission to create an item!');
        }

        // Устанавливаем флаг одобрения модератором
        body.isApprovedByModerator = true;

        // Сохраняем новый товар в базе данных
        const newItem = await this.itemRepository.save(body);

        // Находим всех пользователей, у которых есть товар с таким названием в вишлисте
        const wishlistUsers = await this.wishlistRepository.find({
            where: { itemName: body.name }, // Ищем записи в вишлисте с таким названием товара
            relations: ['user'], // Загружаем связанного пользователя
        });

        // Отправляем уведомление каждому пользователю и удаляем запись из вишлиста
        for (const wishlistEntry of wishlistUsers) {
            if (wishlistEntry.user) {
                try {
                    // Отправляем уведомление о добавлении товара
                    await this.mailService.sendAddedToWishlistNotification(
                        wishlistEntry.user.email, // Email пользователя
                        body.name, // Название товара
                        newItem.id, // ID нового товара
                    );

                    // Удаляем запись из вишлиста после отправки уведомления
                    await this.wishlistRepository.delete({ id: wishlistEntry.id });
                } catch (error) {
                    console.error(`Failed to send notification or remove wishlist entry for user ${wishlistEntry.user.id}:`, error);
                }
            }
        }

        return newItem;
    }

    async reserveItem(itemId: number, userId: number) {
        const currentDate = new Date();

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

        if (item.reservedById && item.reservationExpiry && item.reservationExpiry > currentDate) {
            throw new ConflictException('Item is already reserved and the reservation has not expired yet');
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
        const currentDate = new Date();
        return await this.itemRepository.findAndCount({
            where: { reservedBy: {
                id: userId,
            },
                reservationExpiry: MoreThan(currentDate),
            },
            relations: ['user', 'category'],
        });
    }

    async getItemsPendingApproval(userId: number) {
        const currentDate = new Date();
        return this.itemRepository.find({
            where: {
                user: { id: userId },
                reservedById: Not(IsNull()),
                reservationExpiry: MoreThan(currentDate),
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

        const previousPrice = item.price;

        console.log(body.deletedImages)
        if (body.deletedImages && body.deletedImages.length > 0) {
            for (const image of body.deletedImages) {
                body.images = body.images.filter((img) => img !== image);
            }
        }

        if (body.price !== item.price) {
            item.prices.push(item.price);
        }

        const updatedItem = {
            ...item,
            ...body,
            prices: item.prices,
            images: body.images,
        };

        console.log(body.images);

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

    async addItemToWishlist(itemName: string, userId: number) {
        return await this.wishlistRepository.save({itemName: itemName, userId: userId});
    }

    async retrieveWishlist(id: number) {
        return await this.wishlistRepository.findAndCount({
            where: {
                userId: id
            }
        });
    }

    async deleteFromWishlist(id: number, userId: number) {
        const item = await this.wishlistRepository.findOne({
            where: {
                id: id,
                userId: userId,
            }
        });

        if (!item) {
            throw new UnauthorizedException("You don't have permission to delete this item!");
        }

        return await this.wishlistRepository.delete(id);
    }
}