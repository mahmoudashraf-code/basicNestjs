import { Body, Controller, Delete, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { SessionGuard } from 'src/session.guard';
import { AppService } from '../../app.service';
import { GetUser } from '../../getUser.decorator';
import { iUser } from '../../users/users.interface';
import { iShortcutData } from './shortcut.interface';

@UseGuards(SessionGuard)
@Controller()
export class ShortcutController {
    constructor(private readonly app: AppService) { }
    @Get()
    get(@Res() res: Response, @GetUser() user: iUser) {
        res.json(this.app.file(join("users", user.id, "shortcut.json")).get());
    }

    @Post()
    add(@Res() res: Response, @GetUser() user: iUser, @Body("data") data: iShortcutData) {
        let temp = this.app.file(join("users", user.id, "shortcut.json")).get();
        let id = this.app.getRndString();
        temp[id] = {
            ...data,
            id
        }
        this.app.file(join("users", user.id, "shortcut.json")).write(temp);
        res.end();
    }

    @Delete(":id")
    delete(@Res() res: Response, @Param("id") id: string, @GetUser() user: iUser) {
        let temp = this.app.file(join("users", user.id, "shortcut.json")).get();
        delete temp[id]
        this.app.file(join("users", user.id, "shortcut.json")).write(temp);
        res.end();
    }
}

