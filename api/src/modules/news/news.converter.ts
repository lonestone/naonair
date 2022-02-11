import { Injectable } from '@nestjs/common';
import { compareAsc } from 'date-fns';
import { NewsEntity } from 'src/entities/news.entity';
import { NewsDTO } from '@aireal/dtos';

@Injectable()
export class NewsConverterService {
  public toDTO = (news: NewsEntity): NewsDTO => ({
    ...news,
    isCurrent: compareAsc(news.startDate, new Date()) === -1,
  });
}
