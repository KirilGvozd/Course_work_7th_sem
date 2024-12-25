import {BasketItemController} from "./basketItem.controller";
import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {BasketItem} from "../entities/basketItem.entity";
import {BasketItemService} from "./basketItem.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@Module({
    imports: [TypeOrmModule.forFeature([BasketItem])],
    controllers: [BasketItemController],
    providers: [BasketItemService, JwtAuthGuard],
})
export class BasketItemModule {}