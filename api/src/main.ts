import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { LoggingInterceptor } from './interceptors/log.interceptors';
import { DateInDTOConversionPipe } from './pipes/DateInDTOConversion.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true,
      // forbidUnknownValues: true,
      // forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalPipes(new DateInDTOConversionPipe());
  app.useGlobalInterceptors(new LoggingInterceptor());

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  await app.listen(3001);
}
bootstrap();
