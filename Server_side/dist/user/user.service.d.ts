import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { CreateUserDto } from "./dto/createUserDto";
import { Item } from "../entities/item.entity";
import { MailService } from "../mail/mail.service";
export declare class UserService {
    private userRepository;
    private itemRepository;
    private readonly mailService;
    constructor(userRepository: Repository<User>, itemRepository: Repository<Item>, mailService: MailService);
    create(createUserDto: CreateUserDto): Promise<CreateUserDto & User>;
    createModerator(createUserDto: CreateUserDto): Promise<CreateUserDto & User>;
    addFavouriteItem(itemId: number, userId: number): Promise<User>;
    removeFromFavourites(userId: number, itemId: number): Promise<void>;
    findByEmail(email: string): Promise<User>;
    findOne(id: number): Promise<User>;
    findFavourites(id: number): Promise<Item[]>;
    findModerators(): Promise<[User[], number]>;
}
