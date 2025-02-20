import {ApiProperty, PartialType} from '@nestjs/swagger';
import { CreateItemAttributeDto } from './create-item-attribute.dto';
import {IsOptional} from "class-validator";

export class UpdateItemAttributeDto extends PartialType(CreateItemAttributeDto) {

    @ApiProperty({
        description: "Updated string value of the attribute if this attribute's type is string",
        example: "New value",
        type: String,
    })
    @IsOptional()
    stringValue: string;

    @ApiProperty({
        description: "Updated number value of the attribute if this attribute's type is number",
        example: 52,
        type: Number,
    })
    @IsOptional()
    numberValue: number;

    @ApiProperty({
        description: "Updated boolean value of the attribute if this attribute's type is boolean",
        example: false,
        type: Boolean,
    })
    @IsOptional()
    booleanValue: boolean;
}
