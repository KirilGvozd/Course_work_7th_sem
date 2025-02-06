import {Injectable, UnauthorizedException} from '@nestjs/common';
import { CreateItemAttributeDto } from './dto/create-item-attribute.dto';
import { UpdateItemAttributeDto } from './dto/update-item-attribute.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {ItemAttribute} from "../entities/itemAttribute.entity";
import {Repository} from "typeorm";

@Injectable()
export class ItemAttributeService {
  constructor(@InjectRepository(ItemAttribute) private itemAttributeRepository: Repository<ItemAttribute>) {
  }

  async create(createItemAttributeDto: CreateItemAttributeDto, userRole: string) {
    if (this.checkUserRole(userRole)) {
      return await this.itemAttributeRepository.save(createItemAttributeDto);
    } else {
      throw new UnauthorizedException("You don't have seller's rights!")
    }
  }

  async findAll() {
    return await this.itemAttributeRepository.findAndCount();
  }

  async findOne(id: number) {
    return await this.itemAttributeRepository.findOne({ where: { id } });
  }

  async update(id: number, updateItemAttributeDto: UpdateItemAttributeDto, userRole: string) {
    if (this.checkUserRole(userRole)) {
      return await this.itemAttributeRepository.update(id, updateItemAttributeDto);
    } else {
      throw new UnauthorizedException("You don't have seller's rights!")
    }
  }

  async remove(id: number, userRole: string) {
    if (this.checkUserRole(userRole)) {
      return this.itemAttributeRepository.delete(id);
    } else {
      throw new UnauthorizedException("You don't have seller's rights!")
    }
  }

  private checkUserRole(userRole: string) {
    return userRole === "seller";
  }
}