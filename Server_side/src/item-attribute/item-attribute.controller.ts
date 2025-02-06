import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req} from '@nestjs/common';
import { ItemAttributeService } from './item-attribute.service';
import { CreateItemAttributeDto } from './dto/create-item-attribute.dto';
import { UpdateItemAttributeDto } from './dto/update-item-attribute.dto';
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller('item-attribute')
export class ItemAttributeController {
  constructor(private readonly itemAttributeService: ItemAttributeService) {}

  @Post()
  create(@Body() createItemAttributeDto: CreateItemAttributeDto, @Req() req) {
    return this.itemAttributeService.create(createItemAttributeDto, req.user.role);
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
  update(@Param('id') id: string, @Body() updateItemAttributeDto: UpdateItemAttributeDto, @Req() req) {
    return this.itemAttributeService.update(+id, updateItemAttributeDto, req.user.role);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.itemAttributeService.remove(+id, req.user.role);
  }
}
