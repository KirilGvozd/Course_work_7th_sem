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
exports.ItemController = void 0;
const common_1 = require("@nestjs/common");
const item_service_1 = require("./item.service");
const pagination_dto_1 = require("../pagination.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
let ItemController = class ItemController {
    constructor(itemService) {
        this.itemService = itemService;
    }
    findAll(paginationDto, typeId, minPrice, maxPrice, sellerId) {
        return this.itemService.findAll(paginationDto, { typeId, minPrice, maxPrice, sellerId });
    }
    findOne(id) {
        return this.itemService.findOne(id);
    }
    async create(body, request, files) {
        const price = Number(body.price);
        const typeId = 1;
        if (isNaN(price) || price <= 0) {
            throw new common_1.BadRequestException("Price must be a positive number.");
        }
        if (!Number.isInteger(typeId)) {
            throw new common_1.BadRequestException("Type ID must be an integer.");
        }
        const user = {
            userId: request.user.userId,
            role: request.user.role,
        };
        const itemData = {
            name: body.name,
            description: body.description,
            price,
            prices: [],
            typeId,
            userId: user.userId,
            images: files?.map((file) => file.path) || [],
        };
        return this.itemService.create(itemData, user);
    }
    update(id, body, request, files) {
        const price = Number(body.price);
        const typeId = 1;
        if (isNaN(price) || price <= 0) {
            throw new common_1.BadRequestException("Price must be a positive number.");
        }
        if (!Number.isInteger(typeId)) {
            throw new common_1.BadRequestException("Type ID must be an integer.");
        }
        const itemData = {
            name: body.name,
            description: body.description,
            price,
            prices: [],
            typeId,
            userId: request.user.userId,
            images: files?.map((file) => file.path) || [],
        };
        return this.itemService.update(id, itemData);
    }
    delete(id, request) {
        const userId = request.user.id;
        return this.itemService.delete(id, userId);
    }
};
exports.ItemController = ItemController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully retrieved items list.' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('typeId')),
    __param(2, (0, common_1.Query)('minPrice')),
    __param(3, (0, common_1.Query)('maxPrice')),
    __param(4, (0, common_1.Query)('sellerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto, Number, Number, Number, Number]),
    __metadata("design:returntype", void 0)
], ItemController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item has been found.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Item not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ItemController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Array]),
    __metadata("design:returntype", Promise)
], ItemController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item has been successfully updated.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "You don't have permission to update this item!" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Item not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object, Array]),
    __metadata("design:returntype", void 0)
], ItemController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item has been successfully deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "You don't have permission to delete this item!" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Item not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ItemController.prototype, "delete", null);
exports.ItemController = ItemController = __decorate([
    (0, swagger_1.ApiTags)('Items'),
    (0, common_1.Controller)('item'),
    __metadata("design:paramtypes", [item_service_1.ItemService])
], ItemController);
//# sourceMappingURL=item.controller.js.map