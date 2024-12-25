import {IsArray, IsInt, IsNumber, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateCommentDto {
    @ApiProperty({
        description: "Id of the current user",
    })
    @IsInt()
    userId: number;

    @ApiProperty({
        description: "Id of the seller",
    })
    @IsInt()
    sellerId: number;

    @ApiProperty({
        description: "Images",
        default: [],
    })
    @IsArray()
    attachments: string[]

    @ApiProperty({
        description: "Date of the comment",
    })
    date: string

    @ApiProperty({
        description: "Comment on seller",
        default: "Some comment on the seller",
    })
    @IsString()
    text: string;

    @ApiProperty({
        description: "Rate of the seller",
        default: 5,
    })
    @IsNumber()
    rate: number;
}