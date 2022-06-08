import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { SessionGuard } from 'src/session.guard';
import { AppService } from '../../app.service';
import { GetUser } from '../../getUser.decorator';
import { iUser } from '../../users/users.interface';
import { iWebsite } from './website.interface';

@Controller()
export class WebsiteController {
    constructor(private readonly app: AppService) { }
    @Get(":id")
    get(@Res() res: Response, @Param("id") id: string) {
        res.json(this.app.file(join("users", id, "website.json")).get());
    }

    @UseGuards(SessionGuard)
    @Post()
    save(@Res() res: Response, @GetUser() user: iUser, @Body("data") data: iWebsite) {
        this.app.file(join("users", user.id, "website.json")).write(data);
        res.end();
    }
}

