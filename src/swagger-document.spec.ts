import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { AiController } from './ai/ai.controller';
import { AiService } from './ai/ai.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DevlogsController } from './devlogs/devlogs.controller';
import { DevlogsService } from './devlogs/devlogs.service';
import { ListsController } from './lists/lists.controller';
import { ListsService } from './lists/lists.service';

function getOperation(pathItem: any, method: string) {
  expect(pathItem).toBeDefined();
  const operation = pathItem[method];
  expect(operation).toBeDefined();
  return operation;
}

function expectMultipartRequest(operation: any) {
  expect(operation.requestBody).toBeDefined();
  expect((operation.requestBody as any).content['multipart/form-data']).toBeDefined();
}

describe('Swagger document', () => {
  let app: INestApplication;
  let document: any;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AppController, AiController, ListsController, DevlogsController],
      providers: [
        {
          provide: AppService,
          useValue: { getHello: jest.fn() },
        },
        {
          provide: AiService,
          useValue: { searchgames: jest.fn() },
        },
        {
          provide: ListsService,
          useValue: {},
        },
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

    app = moduleRef.createNestApplication();
    await app.init();

    document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder().setTitle('test').setVersion('1.0').build(),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('documents legacy AI endpoints and system route metadata', () => {
    const rootGet = getOperation(document.paths['/'], 'get');
    expect(rootGet.tags).toContain('system');

    const legacyFilter = getOperation(document.paths['/ai-filter'], 'post');
    expect(legacyFilter.requestBody).toBeDefined();

    const aiFilter = getOperation(document.paths['/api/ai/filter'], 'post');
    expect(aiFilter.requestBody).toBeDefined();
  });

  it('documents lists request bodies and multipart uploads', () => {
    expect(getOperation(document.paths['/api/lists/{userId}'], 'post').requestBody).toBeDefined();
    expect(getOperation(document.paths['/api/lists/{listId}'], 'patch').requestBody).toBeDefined();
    expect(getOperation(document.paths['/api/lists/{listId}/games'], 'post').requestBody).toBeDefined();
    expect(getOperation(document.paths['/api/lists/{userId}/toggle-special'], 'post').requestBody).toBeDefined();

    expectMultipartRequest(getOperation(document.paths['/api/lists/{listId}/upload'], 'post'));

    expectMultipartRequest(getOperation(document.paths['/api/lists/{listId}/games/{gameId}/gallery'], 'post'));
  });

  it('documents devlogs bodies, params, and multipart uploads', () => {
    expect(getOperation(document.paths['/api/devlogs'], 'post').requestBody).toBeDefined();
    expect(getOperation(document.paths['/api/devlogs/{id}'], 'delete').parameters).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'id', in: 'path' })]),
    );
    expect(getOperation(document.paths['/api/devlogs/{projectId}/entries'], 'post').requestBody).toBeDefined();

    expectMultipartRequest(getOperation(document.paths['/api/devlogs/{id}/upload'], 'post'));

    expectMultipartRequest(getOperation(document.paths['/api/devlogs/entries/{entryId}/upload'], 'post'));
  });

  it('emits component schemas for the new DTOs', () => {
    expect(document.components.schemas.AiQueryDto).toBeDefined();
    expect(document.components.schemas.UpdateListDto).toBeDefined();
    expect(document.components.schemas.ToggleSpecialListDto).toBeDefined();
    expect(document.components.schemas.CreateProjectDto).toBeDefined();
    expect(document.components.schemas.CreateEntryDto).toBeDefined();
  });
});