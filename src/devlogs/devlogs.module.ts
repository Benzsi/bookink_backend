import { Module } from '@nestjs/common';
import { DevlogsService } from './devlogs.service';
import { DevlogsController } from './devlogs.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [AuthModule],
  controllers: [DevlogsController],
  providers: [DevlogsService, PrismaService],
})
export class DevlogsModule {}
