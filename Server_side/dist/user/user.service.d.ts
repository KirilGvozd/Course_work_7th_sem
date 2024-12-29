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
    addFavouriteItem(itemId: number, userId: number): Promise<User>;
    removeFromFavourites(userId: number, itemId: number): Promise<void>;
    findAll(paginationDto: PaginationDto): Promise<User[]>;
    findByEmail(email: string): Promise<User>;
    findOne(id: number): Promise<User>;
    findFavourites(id: number): Promise<Item[]>;
}
