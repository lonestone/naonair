import { NewsService } from './news.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateNewsDTO, NewsDTO } from 'src/dtos/news.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  async create(@Body() createNewsDTO: CreateNewsDTO): Promise<NewsDTO> {
    return await this.newsService.create(createNewsDTO);
  }

  @Get()
  async findAll(): Promise<NewsDTO[]> {
    return await this.newsService.findAll();
  }
}
