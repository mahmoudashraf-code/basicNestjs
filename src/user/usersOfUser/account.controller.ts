import { Body, Controller, Get, Param, Post, Put, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { GetUser } from 'src/getUser.decorator';
import { SessionGuard } from 'src/session.guard';
import { iUser } from 'src/users/users.interface';
import { UsersOfUserService } from './usersOfUser.service';
import { Response } from "express";
import { FileInterceptor } from '@nestjs/platform-express';
import { extname, join } from 'path';
import { writeFileSync } from 'fs';

@Controller("account")
@UseGuards(SessionGuard)
export class UserAccountController {
    constructor(private users: UsersOfUserService, private app: AppService) { }
    @Put()
    update(@GetUser() user: iUser, @Body("user") userData: iUser, @Res() res: Response) {
        let data = this.users.getAll(user.hostId)
        data[user.id] = { ...data[user.id], ...userData };
        this.users.save(user.id, data);
        res.end();
    }


    @UseInterceptors(FileInterceptor('file'))
    @Post('uploadIcon')
    uploadFile(@UploadedFile() files: Express.Multer.File, @Res() res: Response, @GetUser() user: iUser) {
        let path = join("img", `${user.id}${extname(files.originalname)}`)
        writeFileSync(join(this.app.path, "users", user.hostId, path), files.buffer);
        let data = this.users.getAll(user.hostId)
        data[user.id].img = path;
        this.users.save(user.id, data);
        res.json({ path });
    }

    @Get("img")
    getAssets(@Res() res: Response, @GetUser() user: iUser) {
        res.sendFile(join(this.app.path, "users", user.hostId, user.img));
    }

    @Get("img/:id")
    getImg(@Res() res: Response, @Param("id") id: string, @GetUser() user: iUser) {
        res.sendFile(join(this.app.path, "users", user.hostId, this.users.getAll(user.hostId)[id].img));
    }
}
