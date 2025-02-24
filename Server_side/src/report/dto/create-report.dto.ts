import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsOptional, IsString} from "class-validator";

export class CreateReportDto {
    @ApiProperty({
        description: "Id of the moderator who will handle this report",
        default: 1,
    })
    @IsNumber()
    @IsOptional()
    moderatorId?: number;

    @ApiProperty({
        description: "Id of the user who send the report",
        default: 1,
    })
    @IsNumber()
    @IsOptional()
    reporterId?: number;

    @ApiProperty({
        description: "Id of the user on whom the report was sent",
        default: 1,
    })
    @IsNumber()
    suspectId: number;

    @ApiProperty({
        description: "Id of the suspicious item",
        default: 1,
    })
    @IsNumber()
    @IsOptional()
    itemId?: number;

    @ApiProperty({
        description: "Message of the report",
        default: "Report message",
    })
    @IsString()
    message: string;
}
