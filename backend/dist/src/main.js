import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { mkdirSync } from 'fs';
import { join } from 'path';
import helmet from 'helmet';
async function bootstrap() {
    mkdirSync(join(process.cwd(), 'uploads'), { recursive: true });
    const app = await NestFactory.create(AppModule);
    app.use(helmet());
    app.enableCors({
        origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
        credentials: true,
    });
    app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.listen(process.env.PORT ?? 3000);
    console.log(`🚀 Server running on port ${process.env.PORT ?? 3000}`);
}
bootstrap();
//# sourceMappingURL=main.js.map