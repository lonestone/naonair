import { NewsService } from './news.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsEntity } from 'src/entities/news.entity';

@Module({
  imports: [MikroOrmModule.forFeature([NewsEntity])],
  providers: [NewsService],
  controllers: [NewsController],
})
export class NewsModule {}
