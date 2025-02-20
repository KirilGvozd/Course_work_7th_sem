import {IsInt, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateCommentDto {
    @ApiProperty({
        description: "Id of the seller",
    })
    @IsInt()
    sellerId: number;

    @ApiProperty({
        description: "Images",
        default: [],
    })
    @IsString({ each: true })
    attachments: string[]

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
    @IsInt()
    rate: number;
}