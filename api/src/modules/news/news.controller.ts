import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put
} from '@nestjs/common';
import { CreateNewsDTO, NewsDTO, UpdateNewsDTO } from 'src/dtos/news.dto';
import { NewsService } from './news.service';

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

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string): Promise<void> {
    return this.newsService.remove(uuid);
  }

  @Patch(':uuid')
  update(
    @Body() updateItemDto: UpdateNewsDTO,
    @Param('uuid') uuid,
  ): Promise<NewsDTO> {
    return this.newsService.update(uuid, updateItemDto);
  }
}
