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
exports.Item = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const category_entity_1 = require("./category.entity");
const itemAttribute_entity_1 = require("./itemAttribute.entity");
let Item = class Item {
};
exports.Item = Item;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Item.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Item.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.id, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Item.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)("money", { array: true }),
    __metadata("design:type", Array)
], Item.prototype, "prices", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { array: true }),
    __metadata("design:type", Array)
], Item.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Item.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Item.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)("money"),
    __metadata("design:type", Number)
], Item.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.User, (user) => user.favourites, { onDelete: "CASCADE" }),
    __metadata("design:type", Array)
], Item.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_1.Category, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "categoryId" }),
    __metadata("design:type", category_entity_1.Category)
], Item.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Item.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => itemAttribute_entity_1.ItemAttribute, itemAttr => itemAttr.item, { onDelete: "CASCADE" }),
    __metadata("design:type", Array)
], Item.prototype, "attributes", void 0);
exports.Item = Item = __decorate([
    (0, typeorm_1.Entity)()
], Item);
//# sourceMappingURL=item.entity.js.map