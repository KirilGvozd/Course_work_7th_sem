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
exports.FavouritesController = void 0;
const common_1 = require("@nestjs/common");
const favourites_service_1 = require("./favourites.service");
const create_favourite_dto_1 = require("./dto/create-favourite.dto");
const update_favourite_dto_1 = require("./dto/update-favourite.dto");
let FavouritesController = class FavouritesController {
    constructor(favouritesService) {
        this.favouritesService = favouritesService;
    }
    create(createFavouriteDto) {
        return this.favouritesService.create(createFavouriteDto);
    }
    findAll() {
        return this.favouritesService.findAll();
    }
    findOne(id) {
        return this.favouritesService.findOne(+id);
    }
    update(id, updateFavouriteDto) {
        return this.favouritesService.update(+id, updateFavouriteDto);
    }
    remove(id) {
        return this.favouritesService.remove(+id);
    }
};
exports.FavouritesController = FavouritesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_favourite_dto_1.CreateFavouriteDto]),
    __metadata("design:returntype", void 0)
], FavouritesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FavouritesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FavouritesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_favourite_dto_1.UpdateFavouriteDto]),
    __metadata("design:returntype", void 0)
], FavouritesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FavouritesController.prototype, "remove", null);
exports.FavouritesController = FavouritesController = __decorate([
    (0, common_1.Controller)('favourites'),
    __metadata("design:paramtypes", [favourites_service_1.FavouritesService])
], FavouritesController);
//# sourceMappingURL=favourites.controller.js.map