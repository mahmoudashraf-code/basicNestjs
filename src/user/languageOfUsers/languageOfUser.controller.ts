import { Body, Controller, Get, Param, Put, Res, UseGuards } from '@nestjs/common';
import { join } from 'path';
import { Response } from "express";
import { AppService } from 'src/app.service';
import { GetUser } from 'src/getUser.decorator';
import { iUser } from 'src/users/users.interface';
import { SessionGuard } from 'src/session.guard';
import { iAllLanguageDataForUser, iLangugeBodyForUser } from './languageOfUser.interface';
import { iLanguageData } from 'src/language/language.interface';

@Controller()
export class LanguageOfUserController {
    constructor(private app: AppService) { }

    @Get("getLang/:userId/:code")
    getLang(@Param('code') code: string, @Param("userId") userId: string): iLangugeBodyForUser {
        return this.app.file(join("users", userId, "language", `${code}.json`)).get();
    }

    @Get("update/getLanguages")
    @UseGuards(SessionGuard)
    getLanguages(@GetUser() user: iUser): iAllLanguageDataForUser {
        let lang: iLanguageData[] = Object.values(this.app.file(join("language", "data.json")).get());
        let data: iAllLanguageDataForUser = {}
        lang.forEach(ele => {
            data[ele.code] = {
                code: ele.code,
                name: ele.name,
                data: this._getFile(user.id, ele.code)
            }
        })
        return data;
    }

    @UseGuards(SessionGuard)
    @Put("update/SaveLanguages")
    saveLanguages(@Res() res: Response, @Body("data") body: iAllLanguageDataForUser, @GetUser() user: iUser) {
        let lang = Object.keys(body);
        lang.forEach(ele => {
            this.app.file(join("users", user.id, "language", `${ele}.json`)).write(body[ele].data);
        })
        res.end();
    }

    _getFile(userId: string, code: string) {
        try {
            return this.app.file(join("users", userId, "language", `${code}.json`)).get()
        } catch (err) {
            return {};
        }
    }
}