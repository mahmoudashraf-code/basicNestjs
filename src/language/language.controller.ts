import { Body, Controller, Delete, Get, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { join } from 'path';
import { AppService } from '../app.service';
import { iLanguge, iLangugeBody } from './language.interface';
import { Response } from "express";
import { unlinkSync } from 'fs';
import { SessionGuard } from 'src/session.guard';
import { RolesGuard } from 'src/users/role/roles.guard';
import { Roles } from 'src/users/role/roles.decorator';
import { Role } from 'src/users/role/role.enum';

@Controller()
export class LanguageController {
    languages: iLanguge = {};
    constructor(private app: AppService) {
        this.init();
    }
    private init() {
        this.languages = this._getAll();
    }
    @Get()
    getAll() {
        return this.languages;
    }

    @Get(":id")
    getLang(@Param('id') id: string) {
        return this.app.file(join("language", `${id}.json`)).get();
    }

    @UseGuards(SessionGuard, RolesGuard)
    @Roles(Role.Admin)
    @Put(":id")
    saveLang(@Param('id') id: string, @Res() res: Response, @Body("data") body: iLangugeBody) {
        this.app.file(join("language", `${id}.json`)).write(body);
        res.end();
    }

    @UseGuards(SessionGuard, RolesGuard)
    @Roles(Role.Admin)
    @Post()
    createLang(@Body("data") data: iLangugeBody, @Res() res: Response) {
        this.languages[data.code] = {
            code: data.code,
            name: data.name
        };
        this._save(this.languages);
        this.app.file(join("language", `${data.code}.json`)).write(data);
        res.end();
    }


    @UseGuards(SessionGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete(':id')
    deleteLang(@Param('id') id: string, @Res() res: Response) {
        delete this.languages[id];
        this._save(this.languages);
        unlinkSync(join("language", `${id}.json`));
        res.end();
    }

    private _getAll() {
        return this.app.file(join("language", "data.json")).get();
    }
    private _save(data: iLanguge) {
        this.app.file(join("language", "data.json")).write(data);
    }
}


