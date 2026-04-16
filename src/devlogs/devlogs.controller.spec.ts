import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { DevlogsController } from './devlogs.controller';
import { DevlogsService } from './devlogs.service';

describe('DevlogsController', () => {
  let controller: DevlogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevlogsController],
      providers: [
        {
          provide: DevlogsService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: { verify: jest.fn() },
        },
        {
          provide: Reflector,
          useValue: { getAllAndOverride: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<DevlogsController>(DevlogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
