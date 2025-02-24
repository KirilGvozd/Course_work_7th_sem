import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/createUserDto";
import { AddToFavouritesDto } from "./dto/addToFavouritesDto";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto, req: any): Promise<CreateUserDto & import("../entities/user.entity").User>;
    addToFavourites(body: AddToFavouritesDto, request: any, response: any): Promise<any>;
    findOne(request: any): Promise<import("../entities/user.entity").User>;
    findModerators(request: any): Promise<[import("../entities/user.entity").User[], number]>;
    findFavourites(request: any): Promise<import("../entities/item.entity").Item[]>;
    removeFromFavourites(itemId: number, request: any, response: any): Promise<any>;
}
