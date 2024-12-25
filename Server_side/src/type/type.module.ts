import {Module} from "@nestjs/common";
import {TypeController} from "./type.controller";
import {TypeService} from "./type.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Type} from "../entities/type.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Type])],
    controllers: [TypeController],
    providers: [TypeService],
})
export class TypeModule {}