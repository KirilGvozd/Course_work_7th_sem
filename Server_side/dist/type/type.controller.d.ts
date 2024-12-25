import { TypeService } from "./type.service";
import { CreateTypeDto } from "./dto/createTypeDto";
import { PaginationDto } from "../pagination.dto";
export declare class TypeController {
    private readonly typeService;
    constructor(typeService: TypeService);
    findAll(paginationDto: PaginationDto): Promise<import("../entities/type.entity").Type[]>;
    findOne(id: number): Promise<import("../entities/type.entity").Type>;
    create(body: CreateTypeDto): Promise<void>;
    update(id: number, body: CreateTypeDto): Promise<void>;
    delete(id: number): Promise<void>;
}
