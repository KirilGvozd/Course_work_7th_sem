import {ConflictException, Injectable, UnauthorizedException} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {Repository} from "typeorm";
import {Category} from "../entities/category.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Item} from "../entities/item.entity";

@Injectable()
export class CategoryService {
  constructor(
      @InjectRepository(Category) private categoryRepository: Repository<Category>,
      @InjectRepository(Item) private itemRepository: Repository<Item>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, userRole: string) {
    if (this.checkUserRole(userRole)) {
      return await this.categoryRepository.save(createCategoryDto);
    } else {
      throw new UnauthorizedException("You don't have admin rights!");
    }
  }

  async findAll() {
    return await this.categoryRepository.findAndCount({
      relations: ['attributes'],
    });
  }

  async findOne(id: number) {
    return await this.categoryRepository.findOne({
      where: { id },
      relations: ['attributes'],
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto, userRole: string) {
    if (this.checkUserRole(userRole)) {
      return await this.categoryRepository.update(id, updateCategoryDto);
    } else {
      throw new UnauthorizedException("You don't have admin rights!");
    }
  }

  async remove(id: number, userRole: string) {
    if (this.checkUserRole(userRole)) {
      const items = await this.itemRepository.find({
        where: {
          categoryId: id,
        },
      });
      if (items.length > 0) {
        throw new ConflictException("Вы не можете удалить категорию, к которой привязаны товары");
      }
      return await this.categoryRepository.delete(id);
    } else {
      throw new UnauthorizedException("You don't have admin rights!");
    }
  }

  private checkUserRole(userRole: string) {
    return userRole === "admin";
  }
}
