"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const basketItem_module_1 = require("./basket_item/basketItem.module");
const chat_module_1 = require("./chat/chat.module");
const comment_module_1 = require("./comment/comment.module");
const item_module_1 = require("./item/item.module");
const type_module_1 = require("./type/type.module");
const user_module_1 = require("./user/user.module");
const bodyParser = require("body-parser");
const config_1 = require("@nestjs/config");
const item_entity_1 = require("./entities/item.entity");
const user_entity_1 = require("./entities/user.entity");
const basketItem_entity_1 = require("./entities/basketItem.entity");
const chat_entity_1 = require("./entities/chat.entity");
const comment_entity_1 = require("./entities/comment.entity");
const type_entity_1 = require("./entities/type.entity");
const auth_module_1 = require("./auth/auth.module");
const chat_gateway_gateway_1 = require("./chat_gateway/chat_gateway.gateway");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const favourites_module_1 = require("./favourites/favourites.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(bodyParser.json()).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            auth_module_1.AuthModule,
            basketItem_module_1.BasketItemModule,
            chat_module_1.ChatModule,
            comment_module_1.CommentModule,
            item_module_1.ItemModule,
            type_module_1.TypeModule,
            user_module_1.UserModule,
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get("DATABASE_HOST"),
                    port: configService.get("DATABASE_PORT"),
                    username: configService.get("DATABASE_USERNAME"),
                    password: configService.get("DATABASE_PASSWORD"),
                    database: configService.get("DATABASE_NAME"),
                    entities: [item_entity_1.Item, user_entity_1.User, basketItem_entity_1.BasketItem, chat_entity_1.Chat, comment_entity_1.Comment, type_entity_1.Type],
                    synchronize: true,
                })
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'uploads'),
                serveRoot: '/uploads',
            }),
            favourites_module_1.FavouritesModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, chat_gateway_gateway_1.ChatGatewayGateway],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map