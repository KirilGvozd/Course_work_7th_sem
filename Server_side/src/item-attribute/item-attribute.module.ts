import { Module } from '@nestjs/common';
import { ItemAttributeService } from './item-attribute.service';
import { ItemAttributeController } from './item-attribute.controller';
import {ItemAttribute} from "../entities/itemAttribute.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Attribute} from "../entities/attribute.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ItemAttribute, Attribute])],
  controllers: [ItemAttributeController],
  providers: [ItemAttributeService],
})
export class ItemAttributeModule {}
