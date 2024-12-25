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
exports.CreateBasketItemDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateBasketItemDto {
}
exports.CreateBasketItemDto = CreateBasketItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Id of the item that you want to add",
    }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateBasketItemDto.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Id of the current user",
    }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateBasketItemDto.prototype, "userId", void 0);
//# sourceMappingURL=createBasketItemDto.js.map