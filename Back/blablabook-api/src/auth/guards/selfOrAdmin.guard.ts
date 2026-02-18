import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'generated/prisma';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SelfOrAdminGuard implements CanActivate {
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
      params: { id: string };
    }>();

    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException(
        "Jeton d'autorisation manquant (ou invalide) dans l'entête de la requête",
      );
    }

    try {
      const payload = await this.jwtService.verifyAsync<{
        id: number;
        type: string;
        iat: number;
        exp: number;
      }>(token);

      if (!payload || typeof payload.id !== 'number') {
        throw new UnauthorizedException('Payload du jeton invalide');
      }

      const user = await this.usersService.findById(payload.id);
      if (!user) {
        throw new UnauthorizedException('Utilisateur non trouvé');
      }

      request.user = user;

      const targetUserId = parseInt(request.params.id);

      const isSelf = user.id === targetUserId;
      const isAdmin = user.roleId === 1;

      if (!isSelf && !isAdmin) {
        throw new ForbiddenException(
          'Accès refusé : vous ne pouvez modifier que votre propre profil',
        );
      }

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      console.error(error);
      throw new UnauthorizedException(
        "Jeton d'autorisation manquant (ou invalide) dans l'entête de la requête",
      );
    }
  }
}
