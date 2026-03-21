import { Test, TestingModule } from '@nestjs/testing';
import { DevlogsController } from './devlogs.controller';

describe('DevlogsController', () => {
  let controller: DevlogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevlogsController],
    }).compile();

    controller = module.get<DevlogsController>(DevlogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
