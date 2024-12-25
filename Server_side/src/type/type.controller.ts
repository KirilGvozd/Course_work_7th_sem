import {Body, Controller, Delete, Get, Param, Post, Put, Query} from "@nestjs/common";
import {TypeService} from "./type.service";
import {CreateTypeDto} from "./dto/createTypeDto";
import {PaginationDto} from "../pagination.dto";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Types')
@Controller('type')
export class TypeController {
    constructor(private readonly typeService: TypeService) {}

    @Get()
    @ApiResponse({ status: 200, description: 'Successfully retrieved types list.'})
    findAll(@Query() paginationDto: PaginationDto) {
        return this.typeService.findAll(paginationDto);
    }

    @Get(':id')
    @ApiResponse({ status: 200, description: 'Type has been found.'})
    @ApiResponse({ status: 404, description: 'Type not found.'})
    findOne(@Param('id') id: number) {
        return this.typeService.findOne(id);
    }

    @Post()
    @ApiResponse({ status: 201, description: 'Type has been successfully created.'})
    @ApiResponse({ status: 400, description: 'Invalid type data provided.'})
    create(@Body() body: CreateTypeDto) {
        return this.typeService.create(body);
    }

    @Put(':id')
    @ApiResponse({ status: 200, description: 'Type has been successfully updated.'})
    @ApiResponse({ status: 404, description: 'Type not found.'})
    @ApiResponse({ status: 400, description: 'Invalid type data provided.'})
    update(@Param('id') id: number, @Body() body: CreateTypeDto) {
        return this.typeService.update(id, body);
    }

    @Delete(':id')
    @ApiResponse({ status: 200, description: 'Type has been successfully deleted.'})
    @ApiResponse({ status: 404, description: 'Type not found.'})
    delete(@Param('id') id: number) {
        return this.typeService.delete(id);
    }
}