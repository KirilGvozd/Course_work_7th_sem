import {IsArray, IsNumber, IsPositive, IsString, Length} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateItemDto {
    @ApiProperty({
        description: 'Array of image URLs for the item',
        type: [String],
        example: ['http://example.com/image1.jpg', 'http://example.com/image2.jpg']
    })
    @IsArray()
    images: string[];

    @ApiProperty({
        description: 'Historical prices of the item',
        type: [Number],
        example: [10.99, 9.99, 8.99],
        default: []
    })
    @IsArray()
    prices: number[] = [];

    @ApiProperty({
        description: 'Name of the item',
        minLength: 1,
        maxLength: 40,
        example: 'Vintage Chair'
    })
    @IsString()
    @Length(1, 40, { message: 'Length error' })
    name: string;

    @ApiProperty({
        description: 'Detailed description of the item',
        example: 'Beautiful vintage chair in excellent condition'
    })
    @IsString()
    description: string;

    @ApiProperty({
        description: 'Current price of the item',
        minimum: 0,
        example: 29.99
    })
    @IsNumber()
    @IsPositive()
    price: number;
}