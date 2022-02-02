import { NewsService } from './news.service';
import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsEntity } from 'src/entities/news.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs/mikro-orm.module';
import { NewsConverterService } from './news.converter';

@Module({
  imports: [MikroOrmModule.forFeature([NewsEntity])],
  providers: [NewsService, NewsConverterService],
  controllers: [NewsController],
})
export class NewsModule {}
