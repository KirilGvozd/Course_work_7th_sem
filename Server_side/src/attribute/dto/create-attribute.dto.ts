import { IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAttributeDto {
    @ApiProperty({
        description: 'The name of the attribute',
        example: 'New Attribute',
        type: String,
    })
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'The category to which the attribute belongs',
        example: 1,
        type: Number,
    })
    @IsNotEmpty()
    categoryId: number;

    @ApiProperty({
        enum: ['STRING', 'NUMBER', 'BOOLEAN'],
        description: 'The type of the attribute',
        example: 'STRING',
        type: String,
    })
    @IsEnum(['STRING', 'NUMBER', 'BOOLEAN'])
    type: 'STRING' | 'NUMBER' | 'BOOLEAN';
}