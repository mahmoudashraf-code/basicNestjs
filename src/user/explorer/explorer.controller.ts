import { Controller, Get, Post, Query, Body, Delete, Res, UseInterceptors, UploadedFiles, Put, UseGuards } from '@nestjs/common';
import { mkdirSync, readdirSync, renameSync, rmdirSync, unlinkSync, writeFileSync } from 'fs';
import { join, extname } from 'path';
import { Response } from "express";
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { jsonPipe } from '../../jsonPipe.pipe';
import { AppService } from '../../app.service';
import { GetUser } from '../../getUser.decorator';
import { iUser } from '../../users/users.interface';
import { iType } from './iType';
import { SessionGuard } from 'src/session.guard';

@Controller()
@UseGuards(SessionGuard)
export class ExplorerController {
  private _path: string = join(this.app.path, "users");
  constructor(public readonly app: AppService) { }

  @Get()
  getApp(@Query("path", jsonPipe) path: string[], @GetUser() user: iUser) {
    let files: { [key: string]: string[] } = {
      folder: [],
      file: [],
      course: [],
      page: [],
      exercise: [],
      movie: []
    }
    readdirSync(this.getPath(user.id, path)).forEach(ele => {
      if (ele.endsWith("@course.json") || ele.endsWith("@page.json") || ele.endsWith("@exercise.json") || ele.endsWith("@movie.json")) {
        files[ele.slice(ele.lastIndexOf("@") + 1, ele.lastIndexOf(".json"))].push(ele);
      } else {
        switch (extname(ele)) {
          case '':
            files['folder'].push(ele);
            break;
          default:
            files['file'].push(ele);
            break;
        }
      }
    });
    return files;
  }

  @Post()
  create(@Body("file") file: { name: string, type: iType }, @Res() res: Response, @Query("path", jsonPipe) path: string[], @GetUser() user: iUser) {
    if (file.type.exe == '')
      mkdirSync(join(this.getPath(user.id, path), file.name));
    else {
      writeFileSync(join(this.getPath(user.id, path), `${file.name}${file.type.exe}`), file.type.content);
    }
    res.json(true);
  }

  @UseInterceptors(AnyFilesInterceptor())
  @Post('upload')
  uploadFile(@UploadedFiles() files: Array<Express.Multer.File>, @Res() res: Response, @Query("path", jsonPipe) path: string[], @GetUser() user: iUser) {
    files.forEach(ele => {
      writeFileSync(join(this.getPath(user.id, path), ele.originalname), ele.buffer);
    })
    res.json(true);
  }

  @Delete('deleteDir')
  deleteDir(@Query('path', jsonPipe) path: string[], @Res() res: Response, @GetUser() user: iUser) {
    rmdirSync(this.getPath(user.id, path), { recursive: true });
    res.json(true);
  }

  @Delete('deleteFile')
  deleteFile(@Query('path', jsonPipe) path: string[], @Res() res: Response, @GetUser() user: iUser) {
    unlinkSync(this.getPath(user.id, path));
    res.json(true);
  }

  @Put()
  rename(@Query('path', jsonPipe) path: string[], @Res() res: Response, @Body("fileName") newName: string[], @GetUser() user: iUser) {
    renameSync(this.getPath(user.id, path), this.getPath(user.id, newName));
    res.json(true);
  }

  getPath(id: string, path: string[]) {
    return join(this._path, id, "explorer", ...path);
  }
}
