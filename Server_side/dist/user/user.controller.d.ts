import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/createUserDto";
import { AddToFavouritesDto } from "./dto/addToFavouritesDto";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<void>;
    addToFavourites(body: AddToFavouritesDto, request: any): Promise<import("../entities/user.entity").User>;
    findOne(request: any): Promise<import("../entities/user.entity").User>;
    findFavourites(request: any): Promise<import("../entities/item.entity").Item[]>;
    removeFromFavourites(itemId: number, request: any): Promise<void>;
}
