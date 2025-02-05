import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ItemAttributeService } from './item-attribute.service';
import { CreateItemAttributeDto } from './dto/create-item-attribute.dto';
import { UpdateItemAttributeDto } from './dto/update-item-attribute.dto';

@Controller('item-attribute')
export class ItemAttributeController {
  constructor(private readonly itemAttributeService: ItemAttributeService) {}

  @Post()
  create(@Body() createItemAttributeDto: CreateItemAttributeDto) {
    return this.itemAttributeService.create(createItemAttributeDto);
  }

  @Get()
  findAll() {
    return this.itemAttributeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemAttributeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemAttributeDto: UpdateItemAttributeDto) {
    return this.itemAttributeService.update(+id, updateItemAttributeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemAttributeService.remove(+id);
  }
}
