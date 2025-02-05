import { Test, TestingModule } from '@nestjs/testing';
import { ItemAttributeService } from './item-attribute.service';

describe('ItemAttributeService', () => {
  let service: ItemAttributeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemAttributeService],
    }).compile();

    service = module.get<ItemAttributeService>(ItemAttributeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
