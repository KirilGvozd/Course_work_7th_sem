import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/createUserDto";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<void>;
    findOne(request: any): Promise<import("../entities/user.entity").User>;
    delete(request: any): Promise<import("typeorm").DeleteResult>;
}
