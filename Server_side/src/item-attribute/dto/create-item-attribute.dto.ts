import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsOptional} from "class-validator";

export class CreateItemAttributeDto {
    @ApiProperty({
        description: "ID of the item",
        example: "1",
        type: Number,
    })
    @IsNotEmpty()
    itemId: number;

    @ApiProperty({
        description: "ID of the attribute",
        example: 1,
        type: Number,
    })
    @IsNotEmpty()
    attributeId: number;

    @ApiProperty({
        description: "String value of the attribute if this attribute's type is string",
        example: "Some value",
        type: String,
    })
    @IsOptional()
    stringValue: string;

    @ApiProperty({
        description: "Number value of the attribute if this attribute's type is number",
        example: 100,
        type: Number,
    })
    @IsOptional()
    numberValue: number;

    @ApiProperty({
        description: "Boolean value of the attribute if this attribute's type is boolean",
        example: true,
        type: Boolean,
    })
    @IsOptional()
    booleanValue: boolean;
}