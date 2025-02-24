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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const createUserDto_1 = require("./dto/createUserDto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const addToFavouritesDto_1 = require("./dto/addToFavouritesDto");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async create(createUserDto, req) {
        if (req.user.role === 'admin') {
            return await this.userService.createModerator(createUserDto);
        }
        else {
            return await this.userService.create(createUserDto);
        }
    }
    async addToFavourites(body, request, response) {
        const itemId = body.itemId;
        const userId = request.user.userId;
        if (request.user.role === 'seller') {
            throw new common_1.ForbiddenException("Seller can't add favourite items!");
        }
        return response.status(200).json(await this.userService.addFavouriteItem(itemId, userId));
    }
    findOne(request) {
        const id = request.user.userId;
        return this.userService.findOne(id);
    }
    async findModerators(request) {
        if (request.user.role !== 'admin') {
            throw new common_1.ForbiddenException("User does not have permission to perform this action");
        }
        return await this.userService.findModerators();
    }
    async findFavourites(request) {
        const userId = request.user.userId;
        const favourites = await this.userService.findFavourites(userId);
        if (!favourites || favourites.length === 0) {
            throw new common_1.NotFoundException('No favourites found for this user.');
        }
        return favourites;
    }
    async removeFromFavourites(itemId, request, response) {
        const userId = request.user.userId;
        await this.userService.removeFromFavourites(userId, itemId);
        return response.status(200).json("Item removed from your favourites");
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createUserDto_1.CreateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('add-favourite'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item added to favourites.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized access.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Seller can\'t add favourite items!' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Item not found' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [addToFavouritesDto_1.AddToFavouritesDto, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addToFavourites", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiExcludeEndpoint)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('moderators'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Moderators retrieved.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized access.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Only for admins!' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findModerators", null);
__decorate([
    (0, common_1.Get)('favourites'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User favourites found.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized access.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findFavourites", null);
__decorate([
    (0, common_1.Delete)('remove-favourite/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item has been successfully deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized access.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User or item not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "removeFromFavourites", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map