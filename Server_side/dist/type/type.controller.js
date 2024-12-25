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
exports.TypeController = void 0;
const common_1 = require("@nestjs/common");
const type_service_1 = require("./type.service");
const createTypeDto_1 = require("./dto/createTypeDto");
const pagination_dto_1 = require("../pagination.dto");
const swagger_1 = require("@nestjs/swagger");
let TypeController = class TypeController {
    constructor(typeService) {
        this.typeService = typeService;
    }
    findAll(paginationDto) {
        return this.typeService.findAll(paginationDto);
    }
    findOne(id) {
        return this.typeService.findOne(id);
    }
    create(body) {
        return this.typeService.create(body);
    }
    update(id, body) {
        return this.typeService.update(id, body);
    }
    delete(id) {
        return this.typeService.delete(id);
    }
};
exports.TypeController = TypeController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully retrieved types list.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], TypeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Type has been found.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Type not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TypeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Type has been successfully created.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid type data provided.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createTypeDto_1.CreateTypeDto]),
    __metadata("design:returntype", void 0)
], TypeController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Type has been successfully updated.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Type not found.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid type data provided.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, createTypeDto_1.CreateTypeDto]),
    __metadata("design:returntype", void 0)
], TypeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Type has been successfully deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Type not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TypeController.prototype, "delete", null);
exports.TypeController = TypeController = __decorate([
    (0, swagger_1.ApiTags)('Types'),
    (0, common_1.Controller)('type'),
    __metadata("design:paramtypes", [type_service_1.TypeService])
], TypeController);
//# sourceMappingURL=type.controller.js.map