import { RoutingProfile } from '@aireal/dtos/dist';
import { HttpService } from '@nestjs/axios';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import appConfig from 'src/configs/app.config';

@Injectable()
export class RoutingService {
  constructor(
    @Inject(appConfig.KEY)
    private readonly _appConfig: ConfigType<typeof appConfig>,
    private httpService: HttpService,
  ) {}
  logger = new Logger('RoutingModule');

  async route(
    startPoint: string,
    endPoint: string,
    profile: RoutingProfile,
  ): Promise<any> {
    const url = `http://${this._appConfig.graphhopperUrl}/route?point=${startPoint}&point=${endPoint}&type=json&locale=fr&key=&elevation=false&points_encoded=false&profile=${profile}`;

    try {
      const promiseFastest = await lastValueFrom(
        this.httpService.get(url + `_fastest`),
      ).catch((e) => this.logger.error('Fastest path : ' + e.message));
      const promiseCleanest = await lastValueFrom(
        this.httpService.get(url + `_cleanest`),
      ).catch((e) => this.logger.error('Cleanest path : ' + e.message));

      const [fastest, cleanest] = await Promise.allSettled([
        promiseFastest,
        promiseCleanest,
      ]);

      return {
        fastest_path:
          fastest.status === 'fulfilled' && fastest.value
            ? fastest.value.data.paths[0]
            : null,
        cleanest_path:
          cleanest.status === 'fulfilled' && cleanest.value
            ? cleanest.value.data.paths[0]
            : null,
      };
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
