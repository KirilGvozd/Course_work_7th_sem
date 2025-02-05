import {Injectable, UnauthorizedException} from '@nestjs/common';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Attribute} from "../entities/attribute.entity";
import {Repository} from "typeorm";

@Injectable()
export class AttributeService {
  constructor( @InjectRepository(Attribute) private attributeRepository: Repository<Attribute>) {}

  async create(createAttributeDto: CreateAttributeDto, userRole: string) {
    if (this.checkUserRole(userRole)) {
      return await this.attributeRepository.save(createAttributeDto);
    } else {
      throw new UnauthorizedException("You don't have admin rights!");
    }
  }

  async findAll() {
    return await this.attributeRepository.findAndCount();
  }

  async findOne(id: number) {
    return await this.attributeRepository.findOne({
      where: {
        id: id,
      }
    });
  }

  async update(id: number, updateAttributeDto: UpdateAttributeDto, userRole: string) {
    if (this.checkUserRole(userRole)) {
      return await this.attributeRepository.update(id, updateAttributeDto);
    } else {
      throw new UnauthorizedException("You don't have admin rights!");
    }
  }

  async remove(id: number, userRole: string) {
    if (this.checkUserRole(userRole)) {
      return await this.attributeRepository.delete(id);
    } else {
      throw new UnauthorizedException("You don't have admin rights!");
    }
  }

  private checkUserRole(userRole: string) {
    return userRole === "admin";
  }
}
