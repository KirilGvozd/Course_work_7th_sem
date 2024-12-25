import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { CreateUserDto } from "./dto/createUserDto";
import { PaginationDto } from "../pagination.dto";
import { Item } from "../entities/item.entity";
export declare class UserService {
    private userRepository;
    private itemRepository;
    constructor(userRepository: Repository<User>, itemRepository: Repository<Item>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(paginationDto: PaginationDto): Promise<User[]>;
    findByEmail(email: string): Promise<User>;
    findOne(id: number): Promise<User>;
    delete(id: number): Promise<import("typeorm").DeleteResult>;
}
