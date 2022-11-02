import { CreateNewsDTO, NewsDTO, UpdateNewsDTO } from '@aireal/dtos';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

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

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createNewsDTO: CreateNewsDTO): Promise<NewsDTO> {
    return await this.newsService.create(createNewsDTO);
  }

  @Patch(':uuid')
  @UseGuards(JwtAuthGuard)
  update(
    @Body() updateItemDto: UpdateNewsDTO,
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<NewsDTO> {
    return this.newsService.update(uuid, updateItemDto);
  }

  @Delete(':uuid')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  remove(@Param('uuid', ParseUUIDPipe) uuid: string): Promise<void> {
    return this.newsService.remove(uuid);
  }
}
