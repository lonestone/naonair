import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './configs/app.config';
import { NewsModule } from './modules/news/news.module';
import ormConfig from './modules/orm/orm.config';
import { OrmModule } from './modules/orm/orm.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [ormConfig, appConfig] }),
    NewsModule,
    OrmModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
