import {IsOptional, IsPositive} from "class-validator";
import {Type} from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class PaginationDto {
    @ApiProperty({
        description: 'Number of items to skip',
        required: false,
        type: Number,
        minimum: 0
    })
    @IsOptional()
    @Type(() => Number)
    skip?: number;

    @ApiProperty({
        description: 'Maximum number of items to return',
        required: false,
        type: Number,
        minimum: 1
    })
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    limit?: number;
}