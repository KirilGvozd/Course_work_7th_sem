import {IsArray, IsInt, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateCommentDto {
    @ApiProperty({
        description: "Id of the current user",
    })
    userId: number;

    @ApiProperty({
        description: "Id of the seller",
    })
    sellerId: number;

    @ApiProperty({
        description: "Images",
        default: [],
    })
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
    rate: number;
}