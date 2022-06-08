import { Body, Controller, Get, NotFoundException, Post, Req, Res, Session, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Request, Response } from "express";
import { Session as inter } from 'express-session';
import { SessionGuard } from 'src/session.guard';
import { iUser } from '../users/users.interface';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller()
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req: Request, @Session() session: Record<string, any>) {
        let user: iUser = req.user as iUser;
        if (await this.authService.userSocket.isLogin(user)) {
            throw new UnauthorizedException(105);
        }
        session.user = user;
        return {
            user: session.user
        };
    }

    @Post('join')
    async join(@Body("user") user: iUser, @Session() session: Record<string, any>) {
        let data = this.authService.usersService.create(user);
        session.user = data;
        return {
            user: data
        };
    }

    @Get('validToken')
    async validToken(@Session() session: Record<string, any>) {
        if (!session.user) {
            throw new NotFoundException(104);
        }
        let user: iUser = this.authService.usersService.users[session.user.id];
        if (await this.authService.userSocket.isLogin(user)) {
            throw new UnauthorizedException(105);
        }
        session.user = user;
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
