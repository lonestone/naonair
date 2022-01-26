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
    const news = await this.newsRepo.findOne(uuid);
    if (!news) {
      throw new NotFoundException(HttpErrors.NEWS_NOT_FOUND);
    }
    return news;
  }

  async create(createNewsDTO: CreateNewsDTO): Promise<NewsEntity> {
    const newsList = await this.newsRepo.findAll();
    // Check if there are already news for this period
    if (!this.isDateAuthorized(createNewsDTO, newsList)) {
      throw new BadRequestException(HttpErrors.EXISTING_CURRENT_NEWS);
    }
    const newsEntity = await this.newsRepo.create(createNewsDTO);
    await this.newsRepo.persistAndFlush(newsEntity);
    return this.converter.toDTO(newsEntity);
  }

  async update(
    uuid: string,
    updateNewsDTO: UpdateNewsDTO,
  ): Promise<NewsEntity> {
    const newsList = await this.findByUuid(uuid);
    if (!newsList) {
      throw new NotFoundException(HttpErrors.NEWS_NOT_FOUND);
    }
    wrap(newsList).assign(updateNewsDTO);
    await this.newsRepo.flush();
    return this.converter.toDTO(newsList);
  }

  async remove(uuid: string): Promise<void> {
    const news = await this.findByUuid(uuid);
    if (!news) {
      throw new NotFoundException(HttpErrors.NEWS_NOT_FOUND);
    }
    await this.newsRepo.removeAndFlush(news);
  }

  private isDateAuthorized(createNews: CreateNewsDTO, news: NewsEntity[]) {
    // if (
    //   isToday(createNewsDTO.startDate) &&
    //   existingNewsList.find((n) => isToday(n.startDate))
    // ) {
    //   throw new BadRequestException(HttpErrors.EXISTING_CURRENT_NEWS);
    // } else if (
    //   !isToday(createNewsDTO.startDate) &&
    //   existingNewsList.find((n) => !isToday(n.startDate))
    // ) {
    // }
    return true;
  }
}
