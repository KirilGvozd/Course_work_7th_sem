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
let ItemService = class ItemService {
    constructor(itemRepo) {
        this.itemRepo = itemRepo;
    }
    async findAll(paginationDto, filters) {
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
        query.skip(paginationDto.skip).take(paginationDto.limit ?? constants_1.DEFAULT_PAGE_SIZE);
        const [items, total] = await query.getManyAndCount();
        return { items, total };
    }
    async findOne(id) {
        const result = await this.itemRepo.findOne({
            where: {
                id
            }
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
        return await this.itemRepo.save(body);
    }
    async update(id, body) {
        const item = await this.itemRepo.findOne({
            where: {
                userId: body.userId,
            }
        });
        if (!item) {
            throw new common_1.UnauthorizedException("You don't have the permission to update this item!");
        }
        if (body.price !== item.price) {
            item.prices.push(item.price);
        }
        body.prices = item.prices;
        return await this.itemRepo.update(id, body);
    }
    async delete(id, userId) {
        const item = await this.itemRepo.findOne({
            where: {
                userId: userId,
            }
        });
        if (!item) {
            throw new common_1.UnauthorizedException("You don't have the permission to delete this item!");
        }
        return await this.itemRepo.delete(id);
    }
};
exports.ItemService = ItemService;
exports.ItemService = ItemService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(item_entity_1.Item)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], ItemService);
//# sourceMappingURL=item.service.js.map