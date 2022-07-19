import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './modules/auth/auth.service';
import { UniqueTokenGuard } from './modules/auth/guards/unique-token-auth.guard';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(UniqueTokenGuard)
  async login() {
    return this.authService.login();
  }

  @Get('checkToken')
  async checkToken(@Request() req: Request) {
    try {
      const token = req.headers['authorization'].split(' ')[1];
      await this.authService.checkToken(token);
      return true;
    } catch (e) {
      return false;
    }
  }
}
