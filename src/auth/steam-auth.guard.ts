import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SteamAuthGuard extends AuthGuard('steam') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    
    // Mivel elötte a JwtAuthGuard lefut, a req.user létezni fog
    if (req.user) {
      req.session.currentUserId = req.user.sub || req.user.id;
    }
    
    const result = (await super.canActivate(context)) as boolean;
    return result;
  }
}
