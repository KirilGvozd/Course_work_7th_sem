import {IsInt, IsOptional, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {Transform} from "class-transformer";

export class CreateCommentDto {
    @ApiProperty({
        description: "Id of the seller",
    })
    @IsInt()
    @Transform(({ value }) => parseInt(value, 10))
    sellerId: number;

    @ApiProperty({
        description: "Images",
        default: [],
    })
    @IsOptional()
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
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    rate: number;
}