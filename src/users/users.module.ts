import { Module } from '@nestjs/common';
import { UsersOfUserModule } from 'src/user/usersOfUser/usersofuser.module';
import { AppService } from '../app.service';
import { AccountController } from './account.controller';
import { AdminChatGateway } from './adminSocket/adminChat.gateway';
import { AdminSessionsGateway } from './adminSocket/adminSessions.gateway';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserChatGateway } from './userSocket/userChat.gateway';
import { UserSessionsGateway } from './userSocket/userSessions.gateway';
import { UserSocketGateway } from './userSocket/userSocket.gateway';
import { UsersOfUserSocketGateway } from './usersOfUserSocket/userSocket.gateway';

@Module({
  providers: [
    UsersService,
    AppService,
    UserSocketGateway,
    UsersOfUserSocketGateway,
    AdminSessionsGateway,
    UserSessionsGateway,
    AdminChatGateway,
    UserChatGateway
  ],
  imports: [
    UsersOfUserModule
  ],
  controllers: [
    UsersController,
    AccountController
  ],
  exports: [
    UsersService,
    UserSocketGateway,
    UsersOfUserSocketGateway
  ],
})
export class UsersModule { }
