import { Module } from '@nestjs/common';
import { ItemAttributeService } from './item-attribute.service';
import { ItemAttributeController } from './item-attribute.controller';
import {ItemAttribute} from "../entities/itemAttribute.entity";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([ItemAttribute])],
  controllers: [ItemAttributeController],
  providers: [ItemAttributeService],
})
export class ItemAttributeModule {}
