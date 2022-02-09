import { Injectable } from '@nestjs/common';
import { compareAsc } from 'date-fns';
import { NewsCategory, NewsDTO } from 'src/dtos/news.dto';
import { NewsEntity } from 'src/entities/news.entity';

@Injectable()
export class NewsConverterService {
  public toDTO = (news: NewsEntity): NewsDTO => ({
    ...news,
    category:
      compareAsc(news.startDate, new Date()) === -1
        ? NewsCategory.Current
        : NewsCategory.Planified,
  });
}
