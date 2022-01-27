import { Controller, Post, UseGuards } from '@nestjs/common';
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
}
