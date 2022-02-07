import { wrap } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/core/entity/EntityRepository';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { compareAsc, compareDesc, isToday, isWithinInterval } from 'date-fns';
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
    // return with date sorting
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
    if (!this.isNewsValid(createNewsDTO, newsList)) {
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
    const newsList = await this.newsRepo.findOne(uuid);
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

  private isNewsValid(createNewsDTO: CreateNewsDTO, news: NewsEntity[]) {
    const now = new Date();
    const currentNews = this.getCurrentNews(news);
    const plannedNews = this.getPlannedNews(news);

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

    // RULE 3 : if exist a current news, start date of incoming news cannot be before
    // end date of current news
    if (compareAsc(createNewsDTO.startDate, currentNews.endDate) == -1) {
      throw new BadRequestException(
        `${HttpErrors.NEWS_CANNOT_START_BEFORE_END_OF_CURRENT} (${currentNews.endDate}) `,
      );
    }

    // RULE 4 : it could be have only 1 planned new
    if (
      plannedNews &&
      compareDesc(currentNews.endDate, createNewsDTO.startDate)
    ) {
      throw new BadRequestException(
        HttpErrors.ONLY_ONE_PLANNED_NEWS_AUTHORIZED,
      );
    }

    // TODO : Delete news with endDate in the past

    return true;
  }

  private getPlannedNews(news: NewsEntity[]) {
    return news.find((n) => n.uuid !== this.getCurrentNews(news).uuid);
  }

  /**
   * Return news considered as current
   * @param news
   */
  private getCurrentNews(news: NewsEntity[]) {
    const now = new Date();
    return news.find(
      (n) => compareDesc(n.startDate, now) && compareDesc(now, n.endDate),
    );
  }
}
