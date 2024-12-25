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
exports.CreateCommentDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateCommentDto {
}
exports.CreateCommentDto = CreateCommentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Id of the current user",
    }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateCommentDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Id of the seller",
    }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateCommentDto.prototype, "sellerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Images",
        default: [],
    }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateCommentDto.prototype, "attachments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Date of the comment",
    }),
    __metadata("design:type", String)
], CreateCommentDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Comment on seller",
        default: "Some comment on the seller",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCommentDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Rate of the seller",
        default: 5,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCommentDto.prototype, "rate", void 0);
//# sourceMappingURL=createCommentDto.js.map