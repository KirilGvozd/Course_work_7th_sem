import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import {Report} from "../entities/report.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {MailModule} from "../mail/mail.module";
import {AuthModule} from "../auth/auth.module";
import {ItemModule} from "../item/item.module";
import {Item} from "../entities/item.entity";
import {User} from "../entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Report, User, Item]), AuthModule, MailModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
