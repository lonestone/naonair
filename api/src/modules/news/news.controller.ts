import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
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

  @Get(':uuid')
  async findByUuid(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<NewsDTO> {
    return await this.newsService.findByUuid(uuid);
  }

  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string): Promise<void> {
    return this.newsService.remove(uuid);
  }

  @Patch(':uuid')
  update(
    @Body() updateItemDto: UpdateNewsDTO,
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<NewsDTO> {
    return this.newsService.update(uuid, updateItemDto);
  }
}
