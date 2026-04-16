import { Test, TestingModule } from '@nestjs/testing';
import { DevlogsService } from './devlogs.service';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { PrismaService } from '../prisma.service';

describe('DevlogsService', () => {
  let service: DevlogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DevlogsService,
        {
          provide: PrismaService,
          useValue: {
            devproject: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            devlogentry: {
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            devprojectfavorite: {
              findUnique: jest.fn(),
              create: jest.fn(),
              delete: jest.fn(),
              findMany: jest.fn(),
            },
            devprojectwishlist: {
              findUnique: jest.fn(),
              create: jest.fn(),
              delete: jest.fn(),
              findMany: jest.fn(),
            },
          },
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

    service = module.get<DevlogsService>(DevlogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
