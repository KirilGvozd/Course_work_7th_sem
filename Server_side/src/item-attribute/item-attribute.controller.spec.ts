import { Test, TestingModule } from '@nestjs/testing';
import { ItemAttributeController } from './item-attribute.controller';
import { ItemAttributeService } from './item-attribute.service';

describe('ItemAttributeController', () => {
  let controller: ItemAttributeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemAttributeController],
      providers: [ItemAttributeService],
    }).compile();

    controller = module.get<ItemAttributeController>(ItemAttributeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
