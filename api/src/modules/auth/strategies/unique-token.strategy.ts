import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import * as Passport from 'passport-unique-token';
import authConfig from 'src/configs/auth.config';
import { HttpErrors } from 'src/dtos/errors.dto';

@Injectable()
export class UniqueTokenStrategy extends PassportStrategy(
  Passport.UniqueTokenStrategy,
  'unique-token',
) {
  @Inject(authConfig.KEY)
  private readonly _authConfig: ConfigType<typeof authConfig>;

  logger = new Logger('AuthModule');

  constructor() {
    super();
  }

  async validate(token: string) {
    console.log('this._authConfig.passKey', this._authConfig.passKey, token);
    if (!this._authConfig.passKey) {
      this.logger.error(
        'No pass key defined in .env. API will be unable to authenticate user.',
      );
      throw new UnauthorizedException(HttpErrors.AUTH_INVALID_TOKEN);
    }
    if (token !== this._authConfig.passKey) {
      throw new UnauthorizedException(HttpErrors.AUTH_INVALID_TOKEN);
    }
    return { token };
  }
}
