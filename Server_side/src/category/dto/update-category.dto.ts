import {ApiProperty, PartialType} from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import {IsNotEmpty} from "class-validator";

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
    @ApiProperty({
        description: "New name of the category",
        example: "Updated name of the category",
        type: String,
    })
    @IsNotEmpty()
    name: string;
}
