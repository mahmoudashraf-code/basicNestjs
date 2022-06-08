import { Body, Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { SessionGuard } from 'src/session.guard';
import { AppService } from '../../app.service';
import { GetUser } from '../../getUser.decorator';
import { jsonPipe } from '../../jsonPipe.pipe';
import { iUser } from '../../users/users.interface';
var AdmZip = require("adm-zip");
import { copySync } from "fs-extra"

@UseGuards(SessionGuard)
@Controller()
export class FileController {
    constructor(private readonly app: AppService) { }

    @Post()
    save(@Body("data") data: any, @Res() res: Response, @Query("path", jsonPipe) path: string[], @GetUser() user: iUser) {
        this.app.file(this.getPath(user.id, path)).write(data);
        res.json(true);
    }

    @Get()
    get(@Res() res: Response, @Query("path", jsonPipe) path: string[], @GetUser() user: iUser) {
        res.json(this.app.file(this.getPath(user.id, path)).get());
    }

    @Get("assets")
    getAssets(@Res() res: Response, @Query("path", jsonPipe) path: string[], @GetUser() user: iUser) {
        res.sendFile(join(this.app.path, this.getPath(user.id, path)), {}, (err) => {
            if (err) {
                res.status(404).send("File Not Found")
            }
        });
    }

    @Get("archive")
    archive(@Res() res: Response, @Query("path", jsonPipe) path: string[], @GetUser() user: iUser) {
        let zip = new AdmZip();
        zip.addLocalFolder(join(this.app.path, this.getPath(user.id, path)));
        res.send(zip.toBuffer());
    }

    @Post("copyTo")
    copyTo(@Res() res: Response, @Body("src") src: string[], @Body("dest") dest: string[], @GetUser() user: iUser) {
        copySync(join(this.app.path, this.getPath(user.id, src)), join(this.app.path, this.getPath(user.id, dest)))
        res.json(true);
    }

    getPath(id: string, path: string[]) {
        return join("users", id, "explorer", ...path);
    }
}