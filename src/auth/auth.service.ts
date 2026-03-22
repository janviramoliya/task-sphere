import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto.js';
import { DatabaseService } from '../database/database.service.js';
import { UserCreateInput } from '../generated/prisma/models.js';
import bcrypt from 'bcrypt';
import { LoggerService } from '../common/logger/logger.service.js';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '../generated/prisma/client.js';

@Injectable()
export class AuthService {
  constructor(
    private databaseService: DatabaseService,
    private logger: LoggerService,
    private jwtService: JwtService,
  ) {}

  async login(loginData: LoginUserDto) {
    try {
      const userData = await this.databaseService.user.findFirst({
        select: { email: true, password: true, id: true, role: true },
        where: { email: loginData.email },
        // where: { email: loginData.email, password: loginData.password },
      });

      let email: string, password: string;

      if (userData) {
        email = userData.email;
        password = userData.password;
      } else {
        throw new UnauthorizedException(
          'Email and password are required to login',
        );
      }

      const passwordMatched = await bcrypt.compare(
        loginData.password,
        password,
      );

      if (!passwordMatched) {
        throw new UnauthorizedException('Invalid email or password');
      } else {
        return {
          access_token: this.jwtService.sign({
            userId: userData.id,
            email: userData.email,
            role: userData.role,
          }),
        };
      }
    } catch (error) {
      // Check if the error is a built-in NestJS HTTP exception
      if (error instanceof UnauthorizedException) {
        // If it's one of your intended HTTP exceptions, rethrow it so NestJS handles it normally
        throw error;
      }

      // If it's not one of the above, it's likely a database or other unexpected error
      this.logger.error('Error occurred during login process', error);
      console.log(error);

      // Optional: Throw a generic error to the client, or use a specific Prisma error if applicable
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle specific Prisma errors here if needed
        throw new InternalServerErrorException(
          'A database error occurred during login',
        );
      }

      // Default catch-all for other errors
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  async register(registerData: UserCreateInput) {
    try {
      const existingUser = await this.databaseService.user.findFirst({
        where: {
          email: registerData.email,
        },
      });

      if (existingUser) {
        throw new BadRequestException('User already exists');
      }

      const hashedPassword = await bcrypt.hash(registerData.password, 10);

      await this.databaseService.user.create({
        data: { ...registerData, password: hashedPassword },
      });

      return 'User registered successfully, please login';
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        // Check if the error is a built-in NestJS HTTP exception
        if (error instanceof BadRequestException) {
          // If it's one of your intended HTTP exceptions, rethrow it so NestJS handles it normally
          throw error;
        }

        // If it's not one of the above, it's likely a database or other unexpected error
        this.logger.error('Error occurred during login process', error);
        console.log(error);

        // Optional: Throw a generic error to the client, or use a specific Prisma error if applicable
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          // Handle specific Prisma errors here if needed
          throw new InternalServerErrorException(
            'A database error occurred during login',
          );
        }

        // Default catch-all for other errors
        throw new InternalServerErrorException('An unexpected error occurred');
      }
    }
  }

  logout() {}
}
