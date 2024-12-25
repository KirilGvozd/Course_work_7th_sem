import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToFavouritesDto {
    @ApiProperty({ example: 123, description: 'ID of the item to add to favourites' })
    @IsInt()
    itemId: number;
}
