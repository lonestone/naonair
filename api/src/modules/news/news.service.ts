import { EntityRepository } from '@mikro-orm/core/entity/EntityRepository';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { isEqual, isToday } from 'date-fns';
import { HttpErrors } from 'src/dtos/errors.dto';
import { CreateNewsDTO } from 'src/dtos/news.dto';
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

    //
    const newsEntity = await this.newsRepo.create(createNewsDTO);
    await this.newsRepo.persistAndFlush(newsEntity);
    return this.converter.toDTO(newsEntity);
  }
}
