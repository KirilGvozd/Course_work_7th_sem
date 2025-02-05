import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req} from '@nestjs/common';
import { AttributeService } from './attribute.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller('attribute')
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @Post()
  create(@Body() createAttributeDto: CreateAttributeDto, @Req() req) {
    return this.attributeService.create(createAttributeDto, req.user.role);
  }

  @Get()
  findAll() {
    return this.attributeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attributeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttributeDto: UpdateAttributeDto, @Req() req) {
    return this.attributeService.update(+id, updateAttributeDto, req.user.role);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.attributeService.remove(+id, req.user.role);
  }
}
