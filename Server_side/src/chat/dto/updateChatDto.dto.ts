import {IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UpdateChatDto {
    @ApiProperty({
        description: "Your edited message",
        default: "Your new edited message",
    })
    @IsString()
    messageText: string;
}