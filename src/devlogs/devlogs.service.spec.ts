import { Test, TestingModule } from '@nestjs/testing';
import { DevlogsService } from './devlogs.service';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('DevlogsService', () => {
  let service: DevlogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DevlogsService,
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

    service = module.get<DevlogsService>(DevlogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
