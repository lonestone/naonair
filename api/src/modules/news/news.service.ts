import {
  CreateNewsDTO,
  HttpErrors,
  NewsDTO,
  UpdateNewsDTO,
} from '@aireal/dtos';
import { wrap } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/core/entity/EntityRepository';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { compareAsc, isToday } from 'date-fns';

import { NewsEntity } from 'src/entities/news.entity';
import { NewsConverterService } from './news.converter';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsEntity)
    public readonly newsRepo: EntityRepository<NewsEntity>,
    private readonly converter: NewsConverterService,
  ) {}

  async findAll(): Promise<NewsDTO[]> {
    return (await this.newsRepo.findAll()).map((n) => this.converter.toDTO(n));
  }

  async findByUuid(uuid: string): Promise<NewsDTO> {
    const news = await this.newsRepo.findOne(uuid);
    if (!news) {
      throw new NotFoundException(HttpErrors.NEWS_NOT_FOUND);
    }
    return this.converter.toDTO(news);
  }

  async create(createNewsDTO: CreateNewsDTO): Promise<NewsDTO> {
    const newsList = await this.newsRepo.findAll();
    // Check if there are already news for this period
    if (
      !this.isNewsValid(
        createNewsDTO,
        newsList.map((n) => this.converter.toDTO(n)),
      )
    ) {
      throw new BadRequestException(HttpErrors.EXISTING_CURRENT_NEWS);
    }
    const newsEntity = await this.newsRepo.create(createNewsDTO);
    await this.newsRepo.persistAndFlush(newsEntity);
    return this.converter.toDTO(newsEntity);
  }

  async update(uuid: string, updateNewsDTO: UpdateNewsDTO): Promise<NewsDTO> {
    const newsList = await this.findByUuid(uuid);
    if (!newsList) {
      throw new NotFoundException(HttpErrors.NEWS_NOT_FOUND);
    }
    wrap(newsList).assign(updateNewsDTO);
    await this.newsRepo.flush();
    return this.converter.toDTO(newsList);
  }

  async remove(uuid: string): Promise<void> {
    const news = await this.newsRepo.findOne(uuid);
    if (!news) {
      throw new NotFoundException(HttpErrors.NEWS_NOT_FOUND);
    }
    await this.newsRepo.removeAndFlush(news);
  }

  private isNewsValid(createNewsDTO: CreateNewsDTO, newsList: NewsDTO[]) {
    const now = new Date();
    const currentNews = newsList.find((n) => n.isCurrent);
    const plannedNews = newsList.find((n) => !n.isCurrent);

    const isCurrent = [-1, 0].includes(
      compareAsc(createNewsDTO.startDate, new Date()),
    );

    // RULE 1 : cannot start in past
    if (
      compareAsc(createNewsDTO.startDate, now) == -1 &&
      !isToday(createNewsDTO.startDate)
    ) {
      throw new BadRequestException(HttpErrors.NEWS_CANNOT_START_IN_PAST);
    }
    // RULE 2 : cannot end in past
    if (
      createNewsDTO.endDate &&
      compareAsc(createNewsDTO.endDate, now) == -1 &&
      !isToday(createNewsDTO.endDate)
    ) {
      throw new BadRequestException(HttpErrors.NEWS_CANNOT_FINISH_IN_PAST);
    }

    // RULE 4 : It could be have only 1 current new
    if (isCurrent && currentNews) {
      throw new BadRequestException(
        HttpErrors.ONLY_ONE_CURRENT_NEWS_AUTHORIZED,
      );
    } else if (!isCurrent) {
      // RULE 4 : it could be have only 1 planned new
      if (plannedNews) {
        throw new BadRequestException(
          HttpErrors.ONLY_ONE_PLANNED_NEWS_AUTHORIZED,
        );
      } else {
        // RULE 3 : if exist a current news, start date of incoming news cannot be before
        // end date of current news
        if (
          currentNews &&
          compareAsc(createNewsDTO.startDate, currentNews.endDate) == -1
        ) {
          throw new BadRequestException(
            `${HttpErrors.NEWS_CANNOT_START_BEFORE_END_OF_CURRENT} (${currentNews.endDate}) `,
          );
        }
      }
    }

    // TODO : Delete news with endDate in the past

    return true;
  }
}
