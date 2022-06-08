import { Body, Controller, Get, NotFoundException, Post, Req, Res, Session, UnauthorizedException, UseGuards } from '@nestjs/common';
import { iUser } from '../../users/users.interface';
import { UserLocalAuthGuard } from './user-local-auth.guard';
import { Request, Response } from "express";
import { UsersOfUserService } from '../usersOfUser/usersOfUser.service';
import { UsersService } from '../../users/users.service';
import { SessionGuard } from 'src/session.guard';
import { Session as inter } from 'express-session';
import { UsersOfUserSocketGateway } from '../../users/usersOfUserSocket/userSocket.gateway';

@Controller()
export class AuthUserController {
    constructor(private usersOfUser: UsersOfUserService, private users: UsersService, private usersOfUserSocket: UsersOfUserSocketGateway) { }
    @UseGuards(UserLocalAuthGuard)
    @Post('login')
    async login(@Req() req: Request, @Session() session: Record<string, any>) {
        let user: iUser = req.user as iUser;
        if (await this.usersOfUserSocket.isUserLogin(user)) {
            throw new UnauthorizedException("login from anther device");
        }
        session.user = user;
        return {
            user
        };
    }

    @Post('join')
    async join(@Body("user") user: iUser, @Body("hostId") hostId: string, @Session() session: Record<string, any>) {
        let userData = this.usersOfUser.createUser(user, hostId)
        session.user = userData;
        return {
            user: userData
        };
    }

    @Get('validToken')
    async validToken(@Session() session: Record<string, any>) {
        if (!session.user) {
            throw new NotFoundException("not found user");
        }
        let user: iUser = session.user;
        if (await this.usersOfUserSocket.isUserLogin(user)) {
            throw new UnauthorizedException("login from anther device");
        }
        let users = this.usersOfUser.getAll(user.hostId);
        users[user.hostId] = this.users.users[user.hostId];

        session.user = users[user.id]
        return {
            user: session.user
        };
    }

    @UseGuards(SessionGuard)
    @Post('logout')
    async logout(@Session() session: inter, @Res() res: Response) {
        session.destroy(() => {
            res.json({
                sucess: true
            })
        });
    }
}
