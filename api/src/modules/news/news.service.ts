import { EntityRepository } from '@mikro-orm/core/entity/EntityRepository';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { NewsDTO } from 'src/dtos/news.dto';
import { NewsEntity } from 'src/entities/news.entity';

@Injectable()
export class NewsService {
  constructor(
    // @Inject(appConfig.KEY)
    // private readonly _appConfig: ConfigType<typeof appConfig>,

    @InjectRepository(NewsEntity)
    public readonly newsRepo: EntityRepository<NewsEntity>,
  ) {}

  async findAll(): Promise<NewsDTO[]> {
    const res = await this.newsRepo.findAll();
    return res as unknown as NewsDTO[];
  }
}
