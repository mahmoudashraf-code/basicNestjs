import { Module } from '@nestjs/common';
import { AppService } from '../../app.service';
import { UserAccountController } from './account.controller';
import { UsersOfUserController } from './usersofuser.controller';
import { UsersOfUserService } from './usersOfUser.service';

@Module({
    imports: [],
    controllers: [UsersOfUserController, UserAccountController],
    providers: [UsersOfUserService, AppService],
    exports: [UsersOfUserService]
})
export class UsersOfUserModule { }
