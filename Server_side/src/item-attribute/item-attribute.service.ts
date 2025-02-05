import { Injectable } from '@nestjs/common';
import { CreateItemAttributeDto } from './dto/create-item-attribute.dto';
import { UpdateItemAttributeDto } from './dto/update-item-attribute.dto';

@Injectable()
export class ItemAttributeService {
  create(createItemAttributeDto: CreateItemAttributeDto) {
    return 'This action adds a new itemAttribute';
  }

  findAll() {
    return `This action returns all itemAttribute`;
  }

  findOne(id: number) {
    return `This action returns a #${id} itemAttribute`;
  }

  update(id: number, updateItemAttributeDto: UpdateItemAttributeDto) {
    return `This action updates a #${id} itemAttribute`;
  }

  remove(id: number) {
    return `This action removes a #${id} itemAttribute`;
  }
}
