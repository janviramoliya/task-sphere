import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { LoggerModule } from '../common/logger/logger.module.js';
import { DatabaseModule } from '../database/database.module.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy.js';
import { AuthGuard } from './auth.guard.js';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    LoggerModule,
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  // providers: [AuthService,JwtStrategy],
  exports: [AuthService, AuthGuard, JwtModule],
})
export class AuthModule {}
