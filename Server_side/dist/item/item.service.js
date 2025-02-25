"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const item_entity_1 = require("../entities/item.entity");
const typeorm_2 = require("@nestjs/typeorm");
const constants_1 = require("../utils/constants");
const mail_service_1 = require("../mail/mail.service");
const user_entity_1 = require("../entities/user.entity");
let ItemService = class ItemService {
    constructor(itemRepository, mailService, userRepository) {
        this.itemRepository = itemRepository;
        this.mailService = mailService;
        this.userRepository = userRepository;
    }
    async findAll(paginationDto, filters) {
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
                    query.andWhere("itemAttribute.numberValue = :exactValue", { exactValue: value });
                }
                else if (typeof value === "object" && value !== null) {
                    if (value.min !== undefined) {
                        query.andWhere("itemAttribute.numberValue >= :minValue", { minValue: value.min });
                    }
                    if (value.max !== undefined) {
                        query.andWhere("itemAttribute.numberValue <= :maxValue", { maxValue: value.max });
                    }
                }
            });
        }
        query.skip(paginationDto.skip).take(paginationDto.limit ?? constants_1.DEFAULT_PAGE_SIZE);
        const [items, total] = await query.getManyAndCount();
        return { items, total };
    }
    async findOne(id) {
        const result = await this.itemRepository.findOne({
            where: {
                id
            },
            relations: ['user', 'attributes', 'category', 'attributes.attribute'],
        });
        if (!result) {
            throw new common_1.NotFoundException("Not Found");
        }
        return result;
    }
    async create(body, user) {
        if (user.role === "buyer") {
            throw new common_1.UnauthorizedException("You dont have permission to create an item!");
        }
        body.isApprovedByModerator = true;
        return await this.itemRepository.save(body);
    }
    async reserveItem(itemId, userId) {
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
            throw new common_1.NotFoundException("There's no such user!");
        }
        if (!item) {
            throw new common_1.NotFoundException('Item not found');
        }
        if (item.reservedById) {
            throw new common_1.ConflictException('Item already reserved');
        }
        item.reservedBy = buyer;
        item.reservationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await this.mailService.sendReservationOfItemNotification(item.user.email, item.name, buyer.name);
        return this.itemRepository.save(item);
    }
    async removeReservation(itemId, userId) {
        const item = await this.itemRepository.findOne({
            where: {
                id: itemId,
            },
            relations: ['user', 'reservedBy'],
        });
        if (!item) {
            throw new common_1.NotFoundException('Item not found');
        }
        if (userId !== item.reservedById) {
            throw new common_1.UnauthorizedException("You dont have permission to remove this reservation!");
        }
        await this.mailService.sendRemovalOfReservationNotification(item.user.email, item.name, item.user.name, item.reservedBy.name);
        item.reservedBy = null;
        item.reservationExpiry = null;
        return await this.itemRepository.save(item);
    }
    async approveReservation(itemId, sellerId) {
        const item = await this.itemRepository.findOne({
            where: {
                id: itemId,
            },
            relations: ['reservedBy'],
        });
        if (item.userId !== sellerId) {
            throw new common_1.UnauthorizedException("You dont have permission to approve this reservation!");
        }
        if (!item.reservedById) {
            throw new common_1.BadRequestException('Item is not reserved');
        }
        if (item.reservationExpiry < new Date()) {
            throw new common_1.GoneException('Reservation expired');
        }
        await this.mailService.sendApprovedReservationNotification(item.reservedBy.email, item.name, item.reservedBy.name);
        return await this.itemRepository.delete(itemId);
    }
    async rejectReservation(itemId, sellerId) {
        const item = await this.itemRepository.findOne({
            where: {
                id: itemId,
            },
            relations: ['reservedBy'],
        });
        if (!item) {
            throw new common_1.NotFoundException('Item not found');
        }
        if (item.userId !== sellerId) {
            throw new common_1.UnauthorizedException("You dont have permission to reject this reservation!");
        }
        await this.mailService.sendRejectReservationNotification(item.reservedBy.email, item.name, item.reservedBy.name);
        item.reservedBy = null;
        item.reservationExpiry = null;
        return this.itemRepository.save(item);
    }
    async getReservedItems(userId) {
        return await this.itemRepository.findAndCount({
            where: { reservedBy: { id: userId } },
            relations: ['user', 'category'],
        });
    }
    async getItemsPendingApproval(userId) {
        return this.itemRepository.find({
            where: {
                user: { id: userId },
                reservedById: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()),
            },
            relations: ['reservedBy', 'category'],
        });
    }
    async update(id, body, userId) {
        const item = await this.itemRepository.findOne({
            where: { id },
        });
        if (!item) {
            throw new common_1.NotFoundException("Item not found.");
        }
        if (item.userId !== userId) {
            throw new common_1.UnauthorizedException("You don't have the permission to update this item!");
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
            const usersToNotify = users.filter((user) => user.favourites.some((favourite) => favourite.id == id));
            for (const user of usersToNotify) {
                await this.mailService.sendPriceUpdateNotification(user.email, item.name, previousPrice, body.price, priceChange);
            }
        }
        return updatedItem;
    }
    async delete(id, userId) {
        const item = await this.itemRepository.findOne({
            where: {
                userId: userId,
            }
        });
        if (!item) {
            throw new common_1.UnauthorizedException("You don't have the permission to delete this item!");
        }
        return await this.itemRepository.delete(id);
    }
    async retrieveExistingImages(id) {
        const item = await this.itemRepository.findOne({
            where: {
                id
            }
        });
        return item.images;
    }
};
exports.ItemService = ItemService;
exports.ItemService = ItemService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(item_entity_1.Item)),
    __param(2, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        mail_service_1.MailService,
        typeorm_1.Repository])
], ItemService);
//# sourceMappingURL=item.service.js.map