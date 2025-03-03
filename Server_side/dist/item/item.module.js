"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemModule = void 0;
const common_1 = require("@nestjs/common");
const item_controller_1 = require("./item.controller");
const item_service_1 = require("./item.service");
const typeorm_1 = require("@nestjs/typeorm");
const item_entity_1 = require("../entities/item.entity");
const jwt_strategy_1 = require("../auth/jwt.strategy");
const platform_express_1 = require("@nestjs/platform-express");
const mail_module_1 = require("../mail/mail.module");
const user_entity_1 = require("../entities/user.entity");
const wishlist_entity_1 = require("../entities/wishlist.entity");
let ItemModule = class ItemModule {
};
exports.ItemModule = ItemModule;
exports.ItemModule = ItemModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([item_entity_1.Item, user_entity_1.User, wishlist_entity_1.Wishlist]),
            platform_express_1.MulterModule.register({
                dest: './uploads',
            }),
            mail_module_1.MailModule,
        ],
        controllers: [item_controller_1.ItemController],
        providers: [item_service_1.ItemService, jwt_strategy_1.JwtStrategy],
    })
], ItemModule);
//# sourceMappingURL=item.module.js.map