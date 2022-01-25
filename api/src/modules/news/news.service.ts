import { wrap } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/core/entity/EntityRepository';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isToday } from 'date-fns';
import { HttpErrors } from 'src/dtos/errors.dto';
import { CreateNewsDTO, UpdateNewsDTO } from 'src/dtos/news.dto';
import { NewsEntity } from 'src/entities/news.entity';
import { NewsConverterService } from './news.converter';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsEntity)
    public readonly newsRepo: EntityRepository<NewsEntity>,
    private readonly converter: NewsConverterService,
  ) {}

  async findAll(): Promise<NewsEntity[]> {
    return (await this.newsRepo.findAll()).map((n) => this.converter.toDTO(n));
  }

  async findByUuid(uuid: string): Promise<NewsEntity> {
    return await this.newsRepo.findOne(uuid);
  }

  async create(createNewsDTO: CreateNewsDTO): Promise<NewsEntity> {
    // Check if there are already news for this period
    const existingNewsList = await this.newsRepo.findAll();
    if (
      isToday(createNewsDTO.startDate) &&
      existingNewsList.find((n) => isToday(n.startDate))
    ) {
      throw new BadRequestException(HttpErrors.EXISTING_CURRENT_NEWS);
    } else if (
      !isToday(createNewsDTO.startDate) &&
      existingNewsList.find((n) => !isToday(n.startDate))
    ) {
    }
    const newsEntity = await this.newsRepo.create(createNewsDTO);
    await this.newsRepo.persistAndFlush(newsEntity);
    return this.converter.toDTO(newsEntity);
  }

  async remove(uuid: string): Promise<void> {
    // Check if news is available for deletion
    const existingNews = await this.findByUuid(uuid);
    if (existingNews) {
      await this.newsRepo.removeAndFlush(existingNews);
    } else {
      throw new NotFoundException(HttpErrors.CANT_FIND_NEWS);
    }
  }

  async update(uuid: string, news: UpdateNewsDTO): Promise<NewsEntity> {
    const existingNews = await this.findByUuid(uuid);
    wrap(existingNews).assign(news);
    await this.newsRepo.flush();
    return this.converter.toDTO(existingNews);
  }
}
