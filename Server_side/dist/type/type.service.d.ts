import { Repository } from "typeorm";
import { Type } from "../entities/type.entity";
import { CreateTypeDto } from "./dto/createTypeDto";
import { PaginationDto } from "../pagination.dto";
export declare class TypeService {
    private typeRepository;
    constructor(typeRepository: Repository<Type>);
    findAll(paginationDto: PaginationDto): Promise<Type[]>;
    findOne(id: number): Promise<Type>;
    create(body: CreateTypeDto): Promise<void>;
    update(id: number, body: CreateTypeDto): Promise<void>;
    delete(id: number): Promise<void>;
}
