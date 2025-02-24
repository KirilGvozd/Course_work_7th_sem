import {Controller, Get, Post, Body, Param, Delete, UseGuards, Req, UnauthorizedException} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  create(@Body() createReportDto: CreateReportDto, @Req() req) {
    if (req.user.role === 'buyer' || req.user.role === 'seller') {
      createReportDto.reporterId = req.user.userId;
      return this.reportService.create(createReportDto);
    } else {
      throw new UnauthorizedException('You do not have permission to send reports');
    }
  }

  @Post('delete-item/:id')
  approveOnItem(@Param('id') id: number, @Req() req) {
    if (req.user.role === 'moderator') {
      return this.reportService.approveReportOnItem(id, req.user.userId);
    } else {
      throw new UnauthorizedException('You do not have permission to send reports');
    }
  }

  @Post('delete-user/:id')
  approveOnUser(@Param('id') id: number, @Req() req) {
    if (req.user.role === 'moderator') {
      return this.reportService.approveReportOnUser(id, req.user.userId);
    } else {
      throw new UnauthorizedException('You do not have permission to send reports');
    }
  }

  @Post('reject-report/:id')
  reject(@Param('id') id: number, @Req() req) {
    if (req.user.role === 'moderator') {
      return this.reportService.rejectReport(id, req.user.userId);
    } else {
      throw new UnauthorizedException('You do not have permission to send reports');
    }
  }

  @Get()
  findAll(@Req() req) {
    return this.reportService.findAll(+req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportService.findOne(+id);
  }
}
