import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ForbiddenException,
  Req,
  Query,
  HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import express from 'express';
import { UsersService } from './users.service';
import { NewUserDTO } from './dto/new-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SelfOrAdminGuard } from 'src/auth/guards/selfOrAdmin.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { OptionalAuthGuard } from 'src/auth/guards/optional-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // It would be a good idea to protect some of the routes to be used only by authenticated (admin) users.
  //! CREATE NEW USER
  @Post()
  create(@Body() data: NewUserDTO) {
    return this.usersService.create(data);
  }

  //! GET ALL USERS
  @Get()
  @UseGuards(AdminGuard)
  async findAll(
    @Query('page') page: string = '0',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
  ) {
    const skip = Number(page) * Number(limit);
    const take = Number(limit);
    const { data, total } = await this.usersService.findAll(skip, take, search);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const usersWithoutPassWword = data.map(({ password, ...user }) => user);
    console.log('--- REQUETE RECUE ---');
    console.log('Search query param:', search);
    return { data: usersWithoutPassWword, total };
  }

  @Get('user-count')
  async getUserCount() {
    return this.usersService.getUserCount();
  }

  //! GET PROFILE USER
  @Get('/profil/:id')
  @UseGuards(OptionalAuthGuard)
  async getprofileById(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: express.Request,
  ) {
    const requestingUserId = request.user?.id;
    const result = await this.usersService.getProfileById(id, requestingUserId);

    if ('error' in result) {
      if (result.error === 'NOT_FOUND') {
        throw new BadRequestException('Utilisateur non trouvé');
      } else if (result.error === 'PRIVATE') {
        throw new ForbiddenException('Ce profil est privé');
      }
    }
    return result.user;
  }

  //! GET USER BY ID
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findById(id);
    if (user) {
      return user;
    }
  }

  //! UPDATE USER BY ID
  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(SelfOrAdminGuard)
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      storage: diskStorage({
        destination: './uploads/profiles',
        filename: (
          _req: Express.Request,
          file: Express.Multer.File,
          cb: (error: Error | null, filename: string) => void,
        ) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),

      fileFilter: (
        _req: Express.Request,
        file: Express.Multer.File,
        cb: (error: Error | null, acceptFile: boolean) => void,
      ) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(
            new BadRequestException('Seules les images sont autorisées'),
            false,
          );
        } else {
          cb(null, true);
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    }),
  )
  @ApiUnauthorizedResponse({
    description:
      "Jeton d'autorisation manquant (ou invalide) dans l'entête de la requête",
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDTO,
    @Req() request: express.Request,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (request.user?.roleId !== 1 && 'roleId' in data) {
      throw new ForbiddenException(
        "Accès refusé : vous n'avez pas la permission de modifier le rôle de l'utilisateur",
      );
    }
    if (file) {
      data.profilePicture = `/uploads/profiles/${file.filename}`;
    }

    if (typeof data.isPrivate === 'string') {
      data.isPrivate = data.isPrivate === 'true';
    }

    return this.usersService.update(id, data);
  }

  //! UPDATE USER ROLE
  @Patch(':id/role')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiUnauthorizedResponse({
    description:
      "Jeton d'autorisation manquant (ou invalide dans l'entête de la requête",
  })
  async updateUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body('roleId', ParseIntPipe) roleId: number,
  ) {
    return this.usersService.updateUserRole(id, { roleId });
  }

  //! DELETE USER BY ID
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(SelfOrAdminGuard)
  @ApiUnauthorizedResponse({
    description:
      "Jeton d'autorisation manquant (ou invalide) dans l'entête de la requête",
  })
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
