import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import { CreateItemAttributeDto } from './dto/create-item-attribute.dto';
import { UpdateItemAttributeDto } from './dto/update-item-attribute.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {ItemAttribute} from "../entities/itemAttribute.entity";
import {Repository} from "typeorm";
import {Attribute} from "../entities/attribute.entity";

@Injectable()
export class ItemAttributeService {
  constructor(
      @InjectRepository(ItemAttribute) private itemAttributeRepository: Repository<ItemAttribute>,
      @InjectRepository(Attribute) private attributeRepository: Repository<Attribute>
      ) {}

  async create(createItemAttributeDto: CreateItemAttributeDto, userRole: string) {
    if (!this.checkUserRole(userRole)) {
      throw new UnauthorizedException("You don't have seller's rights!")
    }

    const attribute = await this.attributeRepository.findOne({
      where: {
        id: createItemAttributeDto.attributeId,
      }
    });

    if (attribute.type === 'STRING') {
      if (createItemAttributeDto.stringValue == null || typeof createItemAttributeDto.stringValue !== 'string') {
        throw new BadRequestException("Invalid attribute type");
      }
    } else if (attribute.type === 'BOOLEAN') {
      if (createItemAttributeDto.booleanValue == null || typeof createItemAttributeDto.booleanValue !== 'boolean') {
        throw new BadRequestException("Invalid attribute type");
      }
    } else if (attribute.type === 'NUMBER') {
      if (createItemAttributeDto.numberValue == null || typeof createItemAttributeDto.numberValue !== 'number') {
        throw new BadRequestException("Invalid attribute type");
      }
    }

    return await this.itemAttributeRepository.save(createItemAttributeDto);
  }

  async findAll() {
    return await this.itemAttributeRepository.findAndCount();
  }

  async findOne(id: number) {
    return await this.itemAttributeRepository.findOne({ where: { id } });
  }

  async update(id: number, updateItemAttributeDto: UpdateItemAttributeDto, userRole: string) {
    if (!this.checkUserRole(userRole)) {
      throw new UnauthorizedException("You don't have seller's rights!");
    }

    const itemAttribute = await this.itemAttributeRepository.findOne({
      where: {
        id: id,
      },
      relations: ['attribute'],
    })

    if (itemAttribute.attribute.type === 'STRING') {
      if (updateItemAttributeDto.stringValue === null) {
        throw new BadRequestException("Invalid attribute type");
      }
    } else if (itemAttribute.attribute.type === 'BOOLEAN') {
      if (updateItemAttributeDto.booleanValue === null) {
        throw new BadRequestException("Invalid attribute type");
      }
    } else if (itemAttribute.attribute.type === 'NUMBER') {
      if (updateItemAttributeDto.numberValue === null) {
        throw new BadRequestException("Invalid attribute type");
      }
    }

    return await this.itemAttributeRepository.update(id, updateItemAttributeDto);
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