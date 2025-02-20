import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ChatModule} from "./chat/chat.module";
import {CommentModule} from "./comment/comment.module";
import {ItemModule} from "./item/item.module";
import {UserModule} from "./user/user.module";
import * as bodyParser from 'body-parser';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {Item} from "./entities/item.entity";
import {User} from "./entities/user.entity";
import {Chat} from "./entities/chat.entity";
import {Comment} from "./entities/comment.entity";
import {AuthModule} from "./auth/auth.module";
import { ChatGatewayGateway } from './chat_gateway/chat_gateway.gateway';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import {Attribute} from "./entities/attribute.entity";
import {Category} from "./entities/category.entity";
import {ItemAttribute} from "./entities/itemAttribute.entity";
import { AttributeModule } from './attribute/attribute.module';
import { CategoryModule } from './category/category.module';
import { ItemAttributeModule } from './item-attribute/item-attribute.module';
import { ReportModule } from './report/report.module';
import {Report} from "./entities/report.entity";


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    ChatModule,
    CommentModule,
    ItemModule,
    UserModule,
    AttributeModule,
      TypeOrmModule.forRootAsync({
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          type: 'postgres',
          host: configService.get<string>("DATABASE_HOST"),
          port: configService.get<number>("DATABASE_PORT"),
          username: configService.get<string>("DATABASE_USERNAME"),
          password: configService.get<string>("DATABASE_PASSWORD"),
          database: configService.get<string>("DATABASE_NAME"),
          entities: [Item, User, Chat, Comment, Attribute, Category, ItemAttribute, Report],
          synchronize: true,
          keepAlive: true,
          logging: true,
          extra: {
            max: 10,
          }
        })
      }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AttributeModule,
    CategoryModule,
    ItemAttributeModule,
    ReportModule,
  ],
  providers: [AppService, ChatGatewayGateway],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(bodyParser.json()).forRoutes('*');
  }
}
