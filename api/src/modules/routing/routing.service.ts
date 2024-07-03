import { GetCustomRouteQualityInput, RoutingProfile } from '@aireal/dtos/dist';
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as Sentry from '@sentry/node';
import { lastValueFrom } from 'rxjs';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { GeoTIFFImage, ReadRasterResult } from 'geotiff';
import appConfig from 'src/configs/app.config';
import { Cron } from '@nestjs/schedule';

const geotiffBbox = [
  [-1.927228156940701, 47.09136660612333],
  [-1.3443056421867574, 47.3612095285679118],
];

const IMAGE_RATIO = 4;

const geotiffRes = [7680 / IMAGE_RATIO, 4960 / IMAGE_RATIO];
@Injectable()
export class RoutingService {
  private readonly geotiffUrl = `https://api.naonair.org/geoserver/aireel/wms?service=WMS&version=1.1.0&request=GetMap&layers=aireel%3Aaireel_indic_7m_atmo_deg&bbox=${geotiffBbox[0][0]},${geotiffBbox[0][1]},${geotiffBbox[1][0]},${geotiffBbox[1][1]}&srs=EPSG%3A4326&styles&format=image%2Fgeotiff8&width=${geotiffRes[0]}&height=${geotiffRes[1]}`;
  private readonly prevGeotiffUrl = `https://api.naonair.org/geoserver/aireel/ows?service=WCS&version=2.0.0&request=GetCoverage&CoverageId=aireel__aireel_indic_21m_atmo_prevision_deg&outputCRS=http://www.opengis.net/def/crs/EPSG/0/4326`;
  private readonly localFilePath = path.join(__dirname, 'data', 'file.tiff');
  private readonly preLocalFilePath = path.join(
    __dirname,
    'data',
    'prev_file.tiff',
  );
  private lastDownloaded: Date;
  private prevLastDownloaded: Date;
  private image: GeoTIFFImage;
  private rasters: ReadRasterResult;
  private prevImage: GeoTIFFImage;
  private prevRasters: ReadRasterResult;

  constructor(
    @Inject(appConfig.KEY)
    private readonly _appConfig: ConfigType<typeof appConfig>,
    private httpService: HttpService,
  ) {
    this.ensureDirectoryExists(path.dirname(this.localFilePath));
    this.ensureDirectoryExists(path.dirname(this.preLocalFilePath));
    this.ensureFreshGeoTIFF();
    this.ensureFreshPrevGeoTIFF();
  }
  logger = new Logger('RoutingModule');

  async getCustomRouteQuality(coords: [number, number][]) {
    const res = await this.getValuesFromCoordinates(coords);
    const values = res.map((v) => v.value);
    const mostCommonValue = values
      .sort(
        (a, b) =>
          values.filter((v) => v === a).length -
          values.filter((v) => v === b).length,
      )
      .pop();
    const val = Math.round((mostCommonValue * 6) / 179);

    return val > 1 ? val : 1;
  }

  private async getValuesFromCoordinates(coords: [number, number][]) {
    const results = [];
    const imageWidth = this.image.getWidth();

    for (const coord of coords) {
      const [lon, lat] = coord;
      const { x, y } = this.latLonToXY(lat, lon, this.image);
      const value = this.rasters[0][y * imageWidth + x];
      results.push({ longitude: lon, latitude: lat, value });
    }

    return results;
  }

  // Triggers every hour on minute 15
  @Cron('15 * * * *')
  async ensureFreshGeoTIFF() {
    this.logger.log('Downloading new GeoTIFF file...');
    const response = await axios.get(this.geotiffUrl, {
      responseType: 'arraybuffer',
    });
    fs.writeFileSync(this.localFilePath, response.data);
    const geotiff = await require('geotiff');
    const tiff = await geotiff.fromFile(this.localFilePath);
    this.image = await tiff.getImage();
    this.rasters = await this.image.readRasters();
    console.log('Downloaded latest GeoTIFF file');
    this.lastDownloaded = new Date();
  }

  private async getForecastFromCoordinates(coords: [number, number][]) {
    const forecast = [];
    const today = new Date(new Date().setMinutes(0, 0, 0));
    const imageWidth = this.prevImage.getWidth();

    for (let i = 0; i < this.prevRasters.length; i++) {
      const results = [];
      for (const coord of coords) {
        const [lon, lat] = coord;
        const { x, y } = this.latLonToXY(lat, lon, this.prevImage);
        const value = this.prevRasters[i][y * imageWidth + x];
        results.push({ longitude: lon, latitude: lat, value });
      }
      const values = results.map((v) => v.value);
      const mostCommonValue = values
        .sort(
          (a, b) =>
            values.filter((v) => v === a).length -
            values.filter((v) => v === b).length,
        )
        .pop();
      forecast.push({
        hour: new Date(new Date(today).setHours(today.getHours() + i)),
        value: mostCommonValue,
      });
    }

    return forecast;
  }

  // Triggers every hour
  @Cron('0 0 * * *')
  async ensureFreshPrevGeoTIFF() {
    this.logger.log('Downloading new prevision GeoTIFF file...');
    const response = await axios.get(this.prevGeotiffUrl, {
      responseType: 'arraybuffer',
    });
    fs.writeFileSync(this.preLocalFilePath, response.data);
    const geotiff = await require('geotiff');
    const tiff = await geotiff.fromFile(this.preLocalFilePath);
    this.prevImage = await tiff.getImage();
    this.prevRasters = await this.prevImage.readRasters();
    console.log('Downloaded latest prevision GeoTIFF file');
    this.prevLastDownloaded = new Date();
  }

  private latLonToXY(lat: number, lon: number, image: GeoTIFFImage) {
    const fileDirectory = image.fileDirectory;
    const originX = fileDirectory.ModelTransformation[3];
    const originY = fileDirectory.ModelTransformation[7];
    const tileSizeX = fileDirectory.ModelTransformation[0];
    const tileSizeY = fileDirectory.ModelTransformation[5];
    const x = Math.round((lon - originX) / tileSizeX);
    const y = Math.round((lat - originY) / tileSizeY);

    return { x, y };
  }

  private ensureDirectoryExists(directory: string) {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  }

  async route(pointList: string[], profile: RoutingProfile) {
    if (pointList.length > 5) {
      throw new BadRequestException('Max 5 waypoint allowed');
    }

    if (this._appConfig.logItinerary) {
      Sentry.captureMessage('Request itinerary', Sentry.Severity.Log);
    }

    const ptParam = pointList.join('&point=');
    const ghProfile =
      profile === RoutingProfile.ElectricBike ? RoutingProfile.Bike : profile;
    const url = `http://${this._appConfig.graphhopperUrl}/route?point=${ptParam}&type=json&locale=fr&key=&elevation=false&points_encoded=false&profile=${ghProfile}`;
    try {
      const promiseFastest = await lastValueFrom(
        this.httpService.get(url + `_fastest`),
      ).catch((e) => {
        this.logger.error('Fastest path : ' + e.message);
        Sentry.captureException(e);
      });

      const promiseCleanest = await lastValueFrom(
        this.httpService.get(url + `_cleanest`),
      ).catch((e) => {
        this.logger.error('Cleanest path : ' + e.message);
        Sentry.captureException(e);
      });

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

  async customRouteQuality(input: GetCustomRouteQualityInput) {
    if (!this.image || !this.rasters) {
      throw new ServiceUnavailableException('Service unavailable');
    }

    return this.getCustomRouteQuality(input.points);
  }

  async customRouteForecast(input: GetCustomRouteQualityInput) {
    if (!this.prevImage || !this.prevRasters) {
      throw new ServiceUnavailableException('Service unavailable');
    }

    return this.getForecastFromCoordinates(input.points);
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
      nb_subPath: hints.nb_subPath,

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
