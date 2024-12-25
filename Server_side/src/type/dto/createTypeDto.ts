import {IsString, Length} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";


export class CreateTypeDto {
    @ApiProperty({
        description: "Type name",
        default: "New type",
    })
    @IsString()
    @Length(1, 40, { message: 'Length error' })
    name: string
}