import {ApiProperty, PartialType} from '@nestjs/swagger';
import { CreateAttributeDto } from './create-attribute.dto';
import {IsEnum, IsNotEmpty} from "class-validator";

export class UpdateAttributeDto extends PartialType(CreateAttributeDto) {
    @ApiProperty({
        enum: ['STRING', 'NUMBER', 'BOOLEAN'],
        description: 'New type of the attribute',
        example: 'STRING',
        type: String,
    })
    @IsEnum(['STRING', 'NUMBER', 'BOOLEAN'])
    type: 'STRING' | 'NUMBER' | 'BOOLEAN';

    @ApiProperty({
        description: 'New name of the attribute',
        example: 'New Attribute',
        type: String,
    })
    @IsNotEmpty()
    name: string;
}

