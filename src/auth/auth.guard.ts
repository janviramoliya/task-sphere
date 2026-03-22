import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private databaseService: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const cookies = request.cookies;

    if (!cookies.token) {
      throw new UnauthorizedException('No Token Provided');
    }

    const jwtSecret = this.configService.get<string>('JWT_SECRET');

    if (!jwtSecret) {
      throw new UnauthorizedException('JWT Secret key not found');
    }

    try {
      const tokenDetails = await this.jwtService.verifyAsync(cookies.token, {
        secret: jwtSecret,
      });

      const userExists = await this.databaseService.user.findFirst({
        where: {
          id: tokenDetails.userId,
          email: tokenDetails.email,
        },
      });

      if (!userExists) {
        throw new UnauthorizedException('Invalid token with userId');
      }

      request['user'] = tokenDetails;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token provided');
    }
  }
}
