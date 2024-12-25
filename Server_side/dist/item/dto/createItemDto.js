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
exports.CreateItemDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateItemDto {
    constructor() {
        this.prices = [];
        this.images = [];
    }
}
exports.CreateItemDto = CreateItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the item type/category',
        type: Number,
        example: 1
    }),
    __metadata("design:type", Number)
], CreateItemDto.prototype, "typeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the user who created the item',
        type: Number,
        example: 1
    }),
    __metadata("design:type", Number)
], CreateItemDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Historical prices of the item',
        type: [Number],
        example: [10.99, 9.99],
        default: []
    }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateItemDto.prototype, "prices", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of image URLs',
        type: [String],
        example: ['http://example.com/image1.jpg'],
        default: []
    }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateItemDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the item',
        minLength: 1,
        maxLength: 40,
        example: 'Vintage Camera'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 40, { message: 'Length error' }),
    __metadata("design:type", String)
], CreateItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Detailed description of the item',
        example: 'Vintage camera in excellent working condition'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateItemDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current price of the item',
        minimum: 0,
        example: 299.99
    }),
    __metadata("design:type", Number)
], CreateItemDto.prototype, "price", void 0);
//# sourceMappingURL=createItemDto.js.map