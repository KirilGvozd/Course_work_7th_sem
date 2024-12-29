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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const user_entity_1 = require("../entities/user.entity");
const constants_1 = require("../utils/constants");
const item_entity_1 = require("../entities/item.entity");
let UserService = class UserService {
    constructor(userRepository, itemRepository) {
        this.userRepository = userRepository;
        this.itemRepository = itemRepository;
    }
    async create(createUserDto) {
        const { favourites, ...userData } = createUserDto;
        const favouriteItems = await this.itemRepository.findByIds(favourites);
        const newUser = this.userRepository.create({
            ...userData,
            favourites: favouriteItems,
        });
        return await this.userRepository.save(newUser);
    }
    async addFavouriteItem(itemId, userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['favourites'],
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const item = await this.itemRepository.findOne({ where: { id: itemId } });
        if (!item)
            throw new common_1.NotFoundException('Item not found');
        if (user.favourites.some((fav) => fav.id === item.id)) {
            throw new common_1.BadRequestException('Item is already in favourites');
        }
        user.favourites.push(item);
        return await this.userRepository.save(user);
    }
    async removeFromFavourites(userId, itemId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['favourites'],
        });
        if (!user)
            throw new common_1.NotFoundException('Пользователь не найден');
        const favouriteItemIds = user.favourites.map((item) => item.id);
        const item = favouriteItemIds.some((id) => id == itemId);
        if (!item)
            throw new common_1.NotFoundException('Элемент отсутствует в избранных');
        await this.userRepository
            .createQueryBuilder()
            .relation(user_entity_1.User, 'favourites')
            .of(userId)
            .remove(itemId);
    }
    async findAll(paginationDto) {
        return await this.userRepository.find({
            skip: paginationDto.skip,
            take: paginationDto.limit ?? constants_1.DEFAULT_PAGE_SIZE,
        });
    }
    async findByEmail(email) {
        return await this.userRepository.findOne({
            where: {
                email,
            }
        });
    }
    async findOne(id) {
        const result = await this.userRepository.findOne({
            where: {
                id
            }
        });
        if (!result)
            throw new common_1.NotFoundException("Not Found");
        return result;
    }
    async findFavourites(id) {
        const user = await this.userRepository.findOne({
            where: {
                id
            },
            relations: ['favourites'],
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found.');
        }
        return await this.itemRepository.findByIds(user.favourites);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_2.InjectRepository)(item_entity_1.Item)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map