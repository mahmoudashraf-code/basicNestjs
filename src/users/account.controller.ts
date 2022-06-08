import { Body, Controller, Get, Param, Post, Put, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { iUser } from './users.interface';
import { UsersService } from './users.service';
import { Response } from "express";
import { FileInterceptor } from '@nestjs/platform-express';
import { writeFileSync } from 'fs';
import { join, extname } from 'path';
import { AppService } from '../app.service';
import { SessionGuard } from 'src/session.guard';
import { GetUser } from 'src/getUser.decorator';

@Controller("account")
@UseGuards(SessionGuard)
export class AccountController {
    constructor(private users: UsersService, private app: AppService) { }
    @Put()
    update(@GetUser() user: iUser, @Body("user") userData: iUser, @Res() res: Response) {
        this.users.update(user.id, userData);
        res.end();
    }

    @UseInterceptors(FileInterceptor('file'))
    @Post(':id/uploadIcon')
    uploadFile(@UploadedFile() files: Express.Multer.File, @Res() res: Response, @Param("id") id: string) {
        let path = join("img", `${id}${extname(files.originalname)}`)
        writeFileSync(join(this.app.path, path), files.buffer);
        this.users.users[id].img = path;
        this.users.save();
        res.json({ path });
    }

    @Get("img")
    getAssets(@Res() res: Response, @GetUser() user: iUser) {
        res.sendFile(join(this.app.path, user.img));
    }

    @Get("img/:id")
    getImg(@Res() res: Response, @Param("id") id: string) {
        res.sendFile(join(this.app.path, this.users.users[id].img));
    }
}
