import { Module } from '@nestjs/common';
import { ItemAttributeService } from './item-attribute.service';
import { ItemAttributeController } from './item-attribute.controller';

@Module({
  controllers: [ItemAttributeController],
  providers: [ItemAttributeService],
})
export class ItemAttributeModule {}
