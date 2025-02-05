import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import * as cookieParser from "cookie-parser";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
      .setTitle("Flea market app API")
      .setDescription("Flea market app API description")
      .setVersion("1.0")
      .addTag("Flea market")
      .addCookieAuth()
      .build();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({origin: "http://localhost:5173", credentials: true});
  app.use(cookieParser());
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  await app.listen(port, '0.0.0.0');
}
bootstrap();