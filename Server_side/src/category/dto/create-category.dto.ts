import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class CreateCategoryDto {
    @ApiProperty({
        description: "Name of the category",
        example: "New category",
        type: String,
    })
    @IsNotEmpty()
    name: string;
}