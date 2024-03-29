import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import authConfig from 'src/configs/auth.config';

@Injectable()
export class AuthService {
  @Inject(authConfig.KEY)
  private readonly _ormConfig: ConfigType<typeof authConfig>;
  constructor(private jwtService: JwtService) {}

  login() {
    const payload = {
      sub: 'anonymous',
    };
    return { access_token: this.jwtService.sign(payload) };
  }

  checkToken(token: string) {
    const res = this.jwtService.verify(token);
    if (new Date().getTime() > res.exp * 1000) {
      throw new Error('Token expired');
    }
  }
}
