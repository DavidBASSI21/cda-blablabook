import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'generated/prisma';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(
    @Inject(UsersService)
    private usersService: UsersService,
    @Inject(JwtService)
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      headers: { authorization?: string };
      user?: Partial<User>;
    }>();

    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    // If no token or invalid format, just continue without user
    if (type !== 'Bearer' || !token) {
      return true;
    }

    try {
      const payload = await this.jwtService.verifyAsync<{
        id: number;
        type: string;
        iat: number;
        exp: number;
      }>(token);

      if (payload && typeof payload.id === 'number') {
        const user = await this.usersService.findById(payload.id);
        if (user) {
          request.user = user;
        }
      }
    } catch {
      // Invalid token, just continue without user
      // No error thrown - this is optional authentication
    }

    // Always allow the request to proceed
    return true;
  }
}
