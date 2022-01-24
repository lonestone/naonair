import { Injectable } from '@nestjs/common';
import { NewsDTO } from 'src/dtos/news.dto';
import { NewsEntity } from 'src/entities/news.entity';

@Injectable()
export class NewsConverterService {
  public toDTO = (news: NewsEntity): NewsDTO => news;
}
