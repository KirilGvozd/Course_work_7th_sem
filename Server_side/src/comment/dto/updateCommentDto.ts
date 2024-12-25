import {IsArray, IsString} from "class-validator";

export class UpdateCommentDto {
    @IsArray()
    attachments: string[]

    @IsString()
    text: string;
}