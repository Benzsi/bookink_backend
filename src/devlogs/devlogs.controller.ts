import { Controller, Get, Post, Body, Param, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { DevlogsService } from './devlogs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller(['api/devlogs', 'devlogs'])
export class DevlogsController {
  constructor(private readonly devlogsService: DevlogsService) {}

  @Get()
  async findAll() {
    return this.devlogsService.getProjects();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.devlogsService.getProjectById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DEVELOPER)
  async createProject(@Req() req: any, @Body() body: any) {
    return this.devlogsService.createProject(req.user.sub, body);
  }

  @Post(':projectId/entries')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DEVELOPER)
  async createEntry(@Param('projectId', ParseIntPipe) projectId: number, @Body() body: any) {
    return this.devlogsService.createEntry(projectId, body);
  }
}
