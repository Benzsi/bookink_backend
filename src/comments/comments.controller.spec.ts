import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

describe('CommentsController', () => {
  let controller: CommentsController;
  let commentsServiceMock: {
    createComment: jest.Mock;
    updateComment: jest.Mock;
    deleteComment: jest.Mock;
    getComment: jest.Mock;
    getBookComments: jest.Mock;
    getUserComments: jest.Mock;
  };

  beforeEach(async () => {
    commentsServiceMock = {
      createComment: jest.fn(),
      updateComment: jest.fn(),
      deleteComment: jest.fn().mockResolvedValue({ id: 1 }),
      getComment: jest.fn(),
      getBookComments: jest.fn(),
      getUserComments: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: commentsServiceMock,
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('deleteComment reads userId from query when body is empty', async () => {
    await controller.deleteComment(12, {
      body: {},
      query: { userId: '7' },
      headers: {},
    });

    expect(commentsServiceMock.deleteComment).toHaveBeenCalledWith(12, 7);
  });
});
