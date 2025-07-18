import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './core/transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { engine } from 'express-handlebars';
import { join } from 'path';
import { PermissionScannerService } from './permissions/permission-scanner.service';
import { configureDayjs } from './core/dayjs.config';

async function bootstrap() {
  configureDayjs();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  if (process.env.SHOULD_SCAN_PERMISSIONS === 'true') {
  await app.get(PermissionScannerService).scanAndCreatePermissions();
}
  //congif engine
  app.engine('hbs', engine({ extname: 'hbs', defaultLayout: null }));
  app.setViewEngine('hbs');
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  const config = new DocumentBuilder()
    .setTitle('HIV Treatment Medical Service')
    .setDescription('The cats API description')
    .setVersion('1.0')
    //.addTag('cats')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'token',
    )
    .addSecurityRequirements('token')
    .build();

  app.enableCors({
    "origin": true,
    "methods": 'GET,HEAD,PUT,PATCH,POST,DELETE',
    "preflightContinue": false,
    credentials: true
  });
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
    }
  }
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
