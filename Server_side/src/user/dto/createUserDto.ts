import {IsArray, IsEmail, IsNumber, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {Type} from "class-transformer";
import {Item} from "../../entities/item.entity";

export class CreateUserDto {
    @ApiProperty({
        description: "Your email address",
        default: "example@example.com",
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: "Your role",
        default: "buyer",
    })
    @IsString()
    role: string;

    @ApiProperty({
        description: "Your password",
        default: "Password1234",
    })
    @IsString()
    password: string;

    @ApiProperty({
        description: "Your name",
        default: "Name",
    })
    @IsString()
    name: string;

    @IsNumber()
    rate: number = 0;

    @IsArray()
    @Type(() => Item)
    favourites: Item[] = [];

    @IsArray()
    @Type(() => Number)
    rates: number[] = [];

    @IsArray()
    @Type(() => Number)
    removedRates: number[] = [];
}