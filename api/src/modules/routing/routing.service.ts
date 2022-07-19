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

  async route(startPoint: string, endPoint: string, profile: RoutingProfile) {
    const ghProfile =
      profile === RoutingProfile.ElectricBike ? RoutingProfile.Bike : profile;
    const url = `http://${this._appConfig.graphhopperUrl}/route?point=${startPoint}&point=${endPoint}&type=json&locale=fr&key=&elevation=false&points_encoded=false&profile=${ghProfile}`;

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
            ? this.formatData(fastest, profile)
            : null,
        cleanest_path:
          cleanest.status === 'fulfilled' && cleanest.value
            ? this.formatData(cleanest, profile)
            : null,
      };
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  private formatData = (
    path: PromiseFulfilledResult<void | any>,
    profile: RoutingProfile,
  ) => {
    const hints = path.value.data.hints;
    const data = {
      qa: hints.qa, // QA must be in [0;6] for app

      // here, QA is in [0;90]
      qa_mode_90: hints.qa_mode_90,
      qa_avg_90: hints.qa_avg_90,
      qa_avg_dist_90: hints.qa_avg_dist_90,
      qa_cumulated_90: hints.qa_cumulated_90,

      nb_points: path.value.data.paths[0].points.coordinates.length,
      ...path.value.data.paths[0],
    };

    // apply speed factor if electric_bike
    if (profile === RoutingProfile.ElectricBike) {
      if (data.time) {
        data.time = data.time * 0.78;
      }
    }

    return data;
  };
}
