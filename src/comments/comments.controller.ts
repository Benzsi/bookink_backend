import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('comments')
@Controller('api/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  private extractUserId(req: any): number {
    const rawHeaderUserId = req?.headers?.['x-user-id'];
    const headerUserId = Array.isArray(rawHeaderUserId)
      ? rawHeaderUserId[0]
      : rawHeaderUserId;

    const candidateValues = [
      req?.user?.id,
      req?.body?.userId,
      req?.query?.userId,
      req?.params?.userId,
      headerUserId,
    ];

    for (const value of candidateValues) {
      const parsed = Number(value);
      if (Number.isInteger(parsed) && parsed > 0) {
        return parsed;
      }
    }

    // Temporary dev fallback until JWT auth is enabled across endpoints.
    return 1;
  }

  // Komment hozzáadása
  @Post()
  @ApiOperation({ summary: 'Új komment hozzáadása egy könyvhöz' })
  @ApiResponse({ status: 201, description: 'Komment sikeresen létrehozva' })
  @ApiResponse({ status: 400, description: 'Hibás adatok' })
  @ApiResponse({ status: 404, description: 'Könyv nem található' })
  @ApiBody({ type: CreateCommentDto })
  async createComment(
    @Request() req,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const userId = this.extractUserId(req);
    return this.commentsService.createComment(userId, createCommentDto);
  }

  // Komment frissítése
  @Put(':id')
  @ApiOperation({ summary: 'Komment frissítése' })
  @ApiParam({ name: 'id', description: 'Komment azonosítója', type: Number })
  @ApiResponse({ status: 200, description: 'Komment sikeresen frissítve' })
  @ApiResponse({ status: 403, description: 'Nincs jogosultság a komment frissítésére' })
  @ApiResponse({ status: 404, description: 'Komment nem található' })
  @ApiBody({ type: UpdateCommentDto })
  async updateComment(
    @Param('id', ParseIntPipe) commentId: number,
    @Request() req,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const userId = this.extractUserId(req);
    return this.commentsService.updateComment(commentId, userId, updateCommentDto);
  }

  // Komment törlése
  @Delete(':id')
  @ApiOperation({ summary: 'Komment törlése' })
  @ApiParam({ name: 'id', description: 'Komment azonosítója', type: Number })
  @ApiResponse({ status: 200, description: 'Komment sikeresen törölve' })
  @ApiResponse({ status: 403, description: 'Nincs jogosultság a komment törlésére' })
  @ApiResponse({ status: 404, description: 'Komment nem található' })
  async deleteComment(
    @Param('id', ParseIntPipe) commentId: number,
    @Request() req,
  ) {
    const userId = this.extractUserId(req);
    return this.commentsService.deleteComment(commentId, userId);
  }

  // Egy komment lekérése ID alapján
  @Get(':id')
  @ApiOperation({ summary: 'Komment lekérése ID alapján' })
  @ApiParam({ name: 'id', description: 'Komment azonosítója', type: Number })
  @ApiResponse({ status: 200, description: 'Komment sikeresen lekérve' })
  @ApiResponse({ status: 404, description: 'Komment nem található' })
  async getComment(@Param('id', ParseIntPipe) commentId: number) {
    return this.commentsService.getComment(commentId);
  }

  // Könyv összes kommentje
  @Get('book/:bookId')
  @ApiOperation({ summary: 'Könyv összes kommentjének lekérése' })
  @ApiParam({ name: 'bookId', description: 'Könyv azonosítója', type: Number })
  @ApiResponse({ status: 200, description: 'Kommentek sikeresen lekérve' })
  async getBookComments(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Request() req,
  ) {
    const viewerId = this.extractUserId(req);
    return this.commentsService.getBookComments(bookId, viewerId);
  }

  // User összes kommentje
  @Get('user/:userId')
  @ApiOperation({ summary: 'Felhasználó összes kommentjének lekérése' })
  @ApiParam({ name: 'userId', description: 'Felhasználó azonosítója', type: Number })
  @ApiResponse({ status: 200, description: 'Kommentek sikeresen lekérve' })
  async getUserComments(@Param('userId', ParseIntPipe) userId: number) {
    return this.commentsService.getUserComments(userId);
  }

  // Komment like/dislike beállítása
  @Put(':id/vote')
  @ApiOperation({ summary: 'Szavazás egy kommentre (like/dislike/remove)' })
  @ApiParam({ name: 'id', description: 'Komment azonosítója', type: Number })
  @ApiResponse({ status: 200, description: 'Komment szavazat frissítve' })
  @ApiResponse({ status: 404, description: 'Komment nem található' })
  @ApiBody({ schema: { type: 'object', properties: { isLike: { type: 'boolean', nullable: true } } } })
  async voteComment(
    @Param('id', ParseIntPipe) commentId: number,
    @Request() req,
    @Body() body: { isLike: boolean | null },
  ) {
    const userId = this.extractUserId(req);
    return this.commentsService.voteComment(commentId, userId, body.isLike);
  }
}