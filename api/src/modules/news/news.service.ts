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
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { compareAsc, format, isPast, isSameDay, isToday } from 'date-fns';
import { NewsEntity } from 'src/entities/news.entity';
import { NewsConverterService } from './news.converter';

@Injectable()
export class NewsService {
  logger = new Logger('NewsModule');

  constructor(
    @InjectRepository(NewsEntity)
    public readonly newsRepo: EntityRepository<NewsEntity>,
    private readonly converter: NewsConverterService,
  ) {}

  async findAll(): Promise<NewsDTO[]> {
    return (
      await this.newsRepo.find({
        endDate: { $gte: format(new Date(), 'yyyy-MM-dd') },
      })
    ).map((n) => this.converter.toDTO(n));
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

    if (createNewsDTO.endDate < createNewsDTO.startDate) {
      throw new BadRequestException(
        HttpErrors.ENDDATE_CANNOT_START_BEFORE_STARTDATE,
      );
    }

    const newsEntity = await this.newsRepo.create(createNewsDTO);
    await this.newsRepo.persistAndFlush(newsEntity);
    this.deleteNewsInPast();
    return this.converter.toDTO(newsEntity);
  }

  async update(uuid: string, updateNewsDTO: UpdateNewsDTO): Promise<NewsDTO> {
    const news = await this.newsRepo.findOne(uuid);
    if (!news) {
      throw new NotFoundException(HttpErrors.NEWS_NOT_FOUND);
    }

    if (updateNewsDTO.endDate < news.startDate) {
      throw new BadRequestException(
        HttpErrors.ENDDATE_CANNOT_START_BEFORE_STARTDATE,
      );
    }

    wrap(news).assign(updateNewsDTO);
    await this.newsRepo.flush();
    this.deleteNewsInPast();
    return this.converter.toDTO(news);
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
    const currentNews = newsList.find((n) => n.isCurrent && !isPast(n.endDate));
    const plannedNews = newsList.find(
      (n) => !n.isCurrent && !isPast(n.endDate),
    );

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
    if (plannedNews) {
      // RULE 5 : current news cannot start the same day as planned news
      if (isSameDay(createNewsDTO.endDate, plannedNews.startDate)) {
        throw new BadRequestException(
          HttpErrors.NEWS_CANNOT_START_SAME_AS_PLANNED,
        );
      }
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
        // RULE 3 : if exist a current news, start date of incoming news cannot before
        // end date of current news
        if (currentNews) {
          if (
            isSameDay(createNewsDTO.startDate, currentNews.endDate) ||
            compareAsc(createNewsDTO.startDate, currentNews.endDate) == -1
          ) {
            throw new BadRequestException(
              `${HttpErrors.NEWS_CANNOT_START_BEFORE_END_OF_CURRENT} (${currentNews.endDate}) `,
            );
          }
        }
      }
    }
    return true;
  }

  private async deleteNewsInPast() {
    try {
      (
        await this.newsRepo.find({
          endDate: { $lt: format(new Date(), 'yyyy-MM-dd') },
        })
      ).map((n) => this.remove(n.uuid));
    } catch (error) {
      this.logger.error(error);
    }
  }
}
