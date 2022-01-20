import { EntityRepository } from '@mikro-orm/core/entity/EntityRepository';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { NewsEntity } from 'src/entities/news.entity';

@Injectable()
export class NewsService {
  constructor(
    // @Inject(appConfig.KEY)
    // private readonly _appConfig: ConfigType<typeof appConfig>,

    @InjectRepository(NewsEntity)
    public readonly newsRepo: EntityRepository<NewsEntity>,
  ) {}

  async findAll(): Promise<NewsEntity[]> {
    const newsEntities = await this.newsRepo.findAll();
    // newsEntities[0].valueNotInBd = 'I want override this, yes please';

    return newsEntities;
  }
}
