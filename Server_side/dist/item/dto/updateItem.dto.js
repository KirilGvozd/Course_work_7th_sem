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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateItemDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UpdateItemDto {
    constructor() {
        this.prices = [];
    }
}
exports.UpdateItemDto = UpdateItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Id of the category',
        minimum: 0,
        example: 29.99
    }),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateItemDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of image URLs for the item',
        type: [String],
        example: ['http://example.com/image1.jpg', 'http://example.com/image2.jpg']
    }),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateItemDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Historical prices of the item',
        type: [Number],
        example: [10.99, 9.99, 8.99],
        default: []
    }),
    (0, class_validator_1.IsPositive)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateItemDto.prototype, "prices", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the item',
        minLength: 1,
        maxLength: 40,
        example: 'Vintage Chair'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(1, 40, { message: 'Length error' }),
    __metadata("design:type", String)
], UpdateItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Detailed description of the item',
        example: 'Beautiful vintage chair in excellent condition'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateItemDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current price of the item',
        minimum: 0,
        example: 29.99
    }),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateItemDto.prototype, "price", void 0);
//# sourceMappingURL=updateItem.dto.js.map