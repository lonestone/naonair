import { NewsService } from './news.service';
import { Controller, Get } from '@nestjs/common';
import { NewsDTO } from 'src/dtos/news.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  findAll(): NewsDTO[] {
    return this.newsService.findAll();
  }
}
