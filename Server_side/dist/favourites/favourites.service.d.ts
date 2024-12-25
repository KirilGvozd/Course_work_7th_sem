import { CreateFavouriteDto } from './dto/create-favourite.dto';
import { UpdateFavouriteDto } from './dto/update-favourite.dto';
export declare class FavouritesService {
    create(createFavouriteDto: CreateFavouriteDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateFavouriteDto: UpdateFavouriteDto): string;
    remove(id: number): string;
}
