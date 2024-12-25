import {Injectable, NotFoundException} from "@nestjs/common";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../entities/user.entity";
import {CreateUserDto} from "./dto/createUserDto";
import {PaginationDto} from "../pagination.dto";
import {DEFAULT_PAGE_SIZE} from "../utils/constants";
import {Item} from "../entities/item.entity";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Item) private itemRepository: Repository<Item>,
    ) {}

    async create(createUserDto: CreateUserDto) {
        const { favourites, ...userData } = createUserDto;
        const favouriteItems = await this.itemRepository.findByIds(favourites);

        const newUser = this.userRepository.create({
            ...userData,
            favourites: favouriteItems,
        });

        return await this.userRepository.save(newUser);
    }

    async findAll(paginationDto: PaginationDto) {
        return await this.userRepository.find({
            skip: paginationDto.skip,
            take: paginationDto.limit ?? DEFAULT_PAGE_SIZE,
        });
    }

    async findByEmail(email: string) {
        return await this.userRepository.findOne({
            where: {
                email,
            }
        })
    }

    async findOne(id: number) {
        const result = await this.userRepository.findOne({
            where: {
                id
            }
        });

        if (!result) throw new NotFoundException("Not Found");

        return result;
    }

    async findFavourites(id: number) {
        const user = await this.userRepository.findOne({
            where: {
                id
            },
            relations: ['favourites'],
        });

        if (!user) {
            throw new NotFoundException('User not found.');
        }

        return await this.itemRepository.findByIds(user.favourites);
    }

    async delete(id: number) {
        return await this.userRepository.delete(id);
    }
}