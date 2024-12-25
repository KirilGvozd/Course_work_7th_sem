"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasketItemModule = void 0;
const basketItem_controller_1 = require("./basketItem.controller");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const basketItem_entity_1 = require("../entities/basketItem.entity");
const basketItem_service_1 = require("./basketItem.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let BasketItemModule = class BasketItemModule {
};
exports.BasketItemModule = BasketItemModule;
exports.BasketItemModule = BasketItemModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([basketItem_entity_1.BasketItem])],
        controllers: [basketItem_controller_1.BasketItemController],
        providers: [basketItem_service_1.BasketItemService, jwt_auth_guard_1.JwtAuthGuard],
    })
], BasketItemModule);
//# sourceMappingURL=basketItem.module.js.map