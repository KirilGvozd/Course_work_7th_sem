"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cookieParser = require("cookie-parser");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle("Flea market app API")
        .setDescription("Flea market app API description")
        .setVersion("1.0")
        .addTag("Flea market")
        .addCookieAuth()
        .build();
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
    app.enableCors({ origin: "http://localhost:5173", credentials: true });
    app.use(cookieParser());
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT');
    await app.listen(port, '0.0.0.0');
}
bootstrap();
//# sourceMappingURL=main.js.map