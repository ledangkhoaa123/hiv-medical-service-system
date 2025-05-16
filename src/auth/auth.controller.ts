import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalAuthGuard } from './local-auth-guard';
import { AuthService } from './auth.service';
import { Public } from 'src/decorator/customize';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Req() req, @Res({ passthrough: true }) res: Response) {
    return this.authService.signIn(req.user, res);
  }
}
