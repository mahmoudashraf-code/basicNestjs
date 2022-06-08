import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../../users/users.module';
import { UsersOfUserModule } from '../usersOfUser/usersofuser.module';
import { AuthUserController } from './authuser.controller';
import { UserLocalStrategy } from './userLocal.strategy';

@Module({
    imports: [
        PassportModule,
        UsersOfUserModule,
        UsersModule
    ],
    controllers: [AuthUserController],
    providers: [UserLocalStrategy],
})
export class AuthUserModule { }
