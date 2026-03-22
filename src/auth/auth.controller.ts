import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import type { UserCreateInput } from '../generated/prisma/models.js';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginData: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { access_token } = await this.authService.login(loginData);
    response.cookie('token', access_token, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });
  }

  @Post('register')
  register(@Body() registerData: UserCreateInput) {
    return this.authService.register(registerData);
  }
}
