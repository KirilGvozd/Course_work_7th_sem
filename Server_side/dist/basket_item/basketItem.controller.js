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
exports.BasketItemController = void 0;
const common_1 = require("@nestjs/common");
const basketItem_service_1 = require("./basketItem.service");
const createBasketItemDto_1 = require("./dto/createBasketItemDto");
const pagination_dto_1 = require("../pagination.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let BasketItemController = class BasketItemController {
    constructor(basketItemService) {
        this.basketItemService = basketItemService;
    }
    async findAll(paginationDto, request) {
        const userId = request.user.userId;
        return await this.basketItemService.findAll(paginationDto, userId);
    }
    async create(body, request) {
        body.userId = request.user.userId;
        if (request.user.role === 'seller') {
            throw new common_1.UnauthorizedException("Seller don't have access to cart!");
        }
        await this.basketItemService.create(body);
    }
    async delete(id, request) {
        const userId = request.user.userId;
        await this.basketItemService.delete(id, userId);
    }
};
exports.BasketItemController = BasketItemController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Your items from cart has been found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "You don't have access to this cart." }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto, Object]),
    __metadata("design:returntype", Promise)
], BasketItemController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Item has been successfully added to your cart' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "You don't have access to add items to cart." }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createBasketItemDto_1.CreateBasketItemDto, Object]),
    __metadata("design:returntype", Promise)
], BasketItemController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Item has been successfully removed from your cart' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "You don't have access to this card!" }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BasketItemController.prototype, "delete", null);
exports.BasketItemController = BasketItemController = __decorate([
    (0, swagger_1.ApiTags)('Basket Items'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('basketItem'),
    __metadata("design:paramtypes", [basketItem_service_1.BasketItemService])
], BasketItemController);
//# sourceMappingURL=basketItem.controller.js.map