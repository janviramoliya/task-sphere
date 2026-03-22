import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UserModule } from './user/user.module.js';
import { WorkspaceModule } from './workspace/workspace.module.js';
import { ProjectModule } from './project/project.module.js';
import { TaskModule } from './task/task.module.js';
import { ActivityLogModule } from './activity-log/activity-log.module.js';
import { AuthModule } from './auth/auth.module.js';
import { DatabaseService } from './database/database.service.js';
import { DatabaseModule } from './database/database.module.js';
import { LoggerModule } from './common/logger/logger.module.js';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    WorkspaceModule,
    ProjectModule,
    TaskModule,
    ActivityLogModule,
    AuthModule,
    DatabaseModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
