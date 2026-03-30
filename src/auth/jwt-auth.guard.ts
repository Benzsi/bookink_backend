import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];
    let token = '';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (request.query && request.query.token) {
      // Támogatás a ?token=... paraméternek (pl. Steam redirect-hez)
      token = request.query.token as string;
    }

    if (!token) {
      throw new UnauthorizedException('Hiányzó vagy érvénytelen token');
    }

    try {
      const payload = this.jwtService.verify(token);
      // A kérés objektumra ráakasszuk a felhasználói adatot
      (request as any).user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Érvénytelen vagy lejárt token');
    }
  }
}
