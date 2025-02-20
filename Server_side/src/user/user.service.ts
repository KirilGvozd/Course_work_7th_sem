import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../entities/user.entity";
import {CreateUserDto} from "./dto/createUserDto";
import {Item} from "../entities/item.entity";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Item) private itemRepository: Repository<Item>,
    ) {}

    async create(createUserDto: CreateUserDto) {
        const { favourites, ...userData } = createUserDto;

        const newUser = this.userRepository.create({
            ...userData,
        });

        return await this.userRepository.save(newUser);
    }

    async addFavouriteItem(itemId: number, userId: number) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['favourites'],
        });
        if (!user) throw new NotFoundException('User not found');

        const item = await this.itemRepository.findOne({ where: { id: itemId } });
        if (!item) throw new NotFoundException('Item not found');

        if (user.favourites.some((fav) => fav.id === item.id)) {
            throw new BadRequestException('Item is already in favourites');
        }

        user.favourites.push(item);

        return await this.userRepository.save(user);
    }

    async removeFromFavourites(userId: number, itemId: number) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['favourites'],
        });
        if (!user) throw new NotFoundException('Пользователь не найден');

        const favouriteItemIds = user.favourites.map((item) => item.id);
        const item = favouriteItemIds.some((id: number) => id == itemId);
        if (!item) throw new NotFoundException('Элемент отсутствует в избранных');

        await this.userRepository
            .createQueryBuilder()
            .relation(User, 'favourites')
            .of(userId)
            .remove(itemId);
    }

    async findByEmail(email: string) {
        try {
            return await this.userRepository.findOne({
                where: {
                    email,
                }
            })
        } catch (error) {
            throw new BadRequestException(error);
        }
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
}