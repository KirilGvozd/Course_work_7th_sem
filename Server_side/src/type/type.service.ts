import {Injectable, NotFoundException} from "@nestjs/common";
import {Repository} from "typeorm";
import {Type} from "../entities/type.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {CreateTypeDto} from "./dto/createTypeDto";
import {PaginationDto} from "../pagination.dto";
import {DEFAULT_PAGE_SIZE} from "../utils/constants";

@Injectable()
export class TypeService {
    constructor(
        @InjectRepository(Type)
        private typeRepository: Repository<Type>
    ) {}

    async findAll(paginationDto: PaginationDto) {
        return await this.typeRepository.find({
            skip: paginationDto.skip,
            take: paginationDto.limit ?? DEFAULT_PAGE_SIZE,
        });
    }

    async findOne(id: number) {
        const result = await this.typeRepository.findOne({
            where: {
                id
            }
        });

        if (!result) throw new NotFoundException("Not Found");

        return result;
    }

    async create(body: CreateTypeDto) {
        await this.typeRepository.save(body);
    }

    async update(id: number, body: CreateTypeDto) {
        await this.typeRepository.update(id, body);
    }

    async delete(id: number) {
        await this.typeRepository.delete(id);
    }
}