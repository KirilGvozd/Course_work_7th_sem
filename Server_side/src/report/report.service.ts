import {Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {CreateReportDto} from './dto/create-report.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Report} from "../entities/report.entity";
import {MailService} from "../mail/mail.service";
import {Item} from "../entities/item.entity";
import {User} from "../entities/user.entity";

@Injectable()
export class ReportService {
  constructor(
      @InjectRepository(Report) private readonly reportRepository: Repository<Report>,
      @InjectRepository(Item) private readonly itemRepository: Repository<Item>,
      @InjectRepository(User) private readonly userRepository: Repository<User>,
      private readonly mailService: MailService,
  ) {}

  async create(createReportDto: CreateReportDto) {
    const moderators = await this.userRepository.find({
      where: {
        role: 'moderator',
      }
    });

    if (!moderators) {
      throw new NotFoundException('There is something wrong now, try to send your report later');
    } else if (moderators.length === 1) {
      createReportDto.moderatorId = moderators[0].id;
    } else if (moderators.length > 1) {
      createReportDto.moderatorId = Math.floor(Math.random() * moderators.length) + 1;
    }

    const moderator = await this.userRepository.findOne({
      where: {
        id: createReportDto.moderatorId,
      }
    })

    const newReport = await this.reportRepository.save(createReportDto);
    await this.mailService.sendReportNotification(moderator.email, newReport.id);

    return newReport;
  }

  async approveReportOnItem(reportId: number, userId: number) {
    const report = await this.reportRepository.findOne({
      where: {
        id: reportId,
      },
      relations: ['item', 'item.user', 'moderator'],
    });

    if (!report) {
      throw new NotFoundException(`Report with id ${reportId} not found`);
    }

    if (userId !== report.moderator.id) {
      throw new UnauthorizedException('You cannot work with this report!');
    }

    await this.mailService.sendRemovalOfItemMessage(report.item.user.email, report.item.name, report.item.user.name);
    await this.reportRepository.delete(reportId);
    return await this.itemRepository.delete(report.itemId);
  }

  async approveReportOnUser(reportId: number, userId: number) {
    const report = await this.reportRepository.findOne({
      where: {
        id: reportId,
      },
      relations: ['suspect'],
    });

    if (!report) {
      throw new NotFoundException(`Report with id ${reportId} not found`);
    }

    console.log(`${report.moderatorId}  ${userId}`);
    if (userId !== report.moderatorId) {
      throw new UnauthorizedException('You cannot work with this report!');
    }

    await this.mailService.sendRemovalOfUserMessage(report.suspect.email, report.suspect.name);
    await this.reportRepository.delete(reportId);
    return await this.userRepository.delete(report.suspectId);
  }

  async rejectReport(reportId: number, userId: number) {
    const report = await this.reportRepository.findOne({
      where: {
        id: reportId,
      },
      relations: ['moderator'],
    });

    if (!report) {
      throw new NotFoundException(`Report with id ${reportId} not found`);
    }

    if (userId !== report.moderator.id) {
      throw new UnauthorizedException('You cannot work with this report!');
    }

    return await this.reportRepository.delete(reportId);
  }

  async findAll(userId: number) {
    return this.reportRepository.findAndCount({
      where: {
        moderatorId: userId,
      }
    });
  }

  async findOne(id: number) {
    return await this.reportRepository.findOne({
      where: {
        id: id,
      }
    });
  }
}
