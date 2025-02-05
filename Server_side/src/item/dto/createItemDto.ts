import {IsArray, IsString, Length} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateItemDto {
    @ApiProperty({
        description: 'ID of the item category',
        type: Number,
        example: 1
    })
    categoryId: number;

    @ApiProperty({
        description: 'ID of the user who created the item',
        type: Number,
        example: 1
    })
    userId: number;

    @ApiProperty({
        description: 'Historical prices of the item',
        type: [Number],
        example: [10.99, 9.99],
        default: []
    })
    @IsArray()
    prices: number[] = [];

    @ApiProperty({
        description: 'Array of image URLs',
        type: [String],
        example: ['http://example.com/image1.jpg'],
        default: []
    })
    @IsArray()
    images: string[] = [];

    @ApiProperty({
        description: 'Name of the item',
        minLength: 1,
        maxLength: 40,
        example: 'Vintage Camera'
    })
    @IsString()
    @Length(1, 40, { message: 'Length error' })
    name: string;

    @ApiProperty({
        description: 'Detailed description of the item',
        example: 'Vintage camera in excellent working condition'
    })
    @IsString()
    description: string;

    @ApiProperty({
        description: 'Current price of the item',
        minimum: 0,
        example: 299.99
    })
    price: number;
}