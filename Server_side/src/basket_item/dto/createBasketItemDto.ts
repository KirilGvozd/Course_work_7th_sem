import {IsInt} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateBasketItemDto {
    @ApiProperty({
        description: "Id of the item that you want to add",
    })
    @IsInt()
    itemId: number;

    @ApiProperty({
        description: "Id of the current user",
    })
    @IsInt()
    userId: number;
}