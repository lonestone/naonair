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
  logger = new Logger('AlertsModule');

  async route(
    startPoint: string,
    endPoint: string,
    profile: RoutingProfile,
  ): Promise<any> {
    const urlWithoutProfile = `http://${this._appConfig.graphhopperUrl}/route?point=${startPoint}&point=${endPoint}&type=json&locale=fr&key=&elevation=false&points_encoded=false`;

    try {
      const promiseFastest = await lastValueFrom(
        this.httpService.get(urlWithoutProfile + `&profile=${profile}`),
      );
      const promiseCleanest = await lastValueFrom(
        this.httpService.get(
          urlWithoutProfile + `&profile=${profile}_cleanest`,
        ),
      );

      const responses = await Promise.all([promiseFastest, promiseCleanest]);

      const fastest = responses[0].data;
      const cleanest = responses[1].data;

      return {
        fastest_path: fastest.paths[0] || null,
        cleanest_path: cleanest.paths[0] || null,
      };
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
