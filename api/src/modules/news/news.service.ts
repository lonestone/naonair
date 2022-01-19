import { Injectable } from '@nestjs/common';
import { NewsDTO } from 'src/dtos/news.dto';

@Injectable()
export class NewsService {
  findAll(): NewsDTO[] {
    return;
  }
}
