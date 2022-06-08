import { Body, Controller, Delete, Get, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from "express";
import { iUser } from './users.interface';
import { Role } from './role/role.enum';
import { Roles } from './role/roles.decorator';
import { SessionGuard } from 'src/session.guard';
import { RolesGuard } from './role/roles.guard';

@Controller()
@UseGuards(SessionGuard, RolesGuard)
@Roles(Role.Admin)
export class UsersController {
    constructor(private users: UsersService) { }
    @Post()
    create(@Body("user") user: iUser, @Res() res: Response) {
        this.users.create(user);
        res.end();
    }

    @Get()
    getAll(@Res() res: Response) {
        res.json(this.users.getAll());
    }

    @Get(":id")
    get(@Res() res: Response, @Param('id') id: string) {
        res.json(this.users.users[id]);
    }

    @Delete(':id')
    deleteDir(@Param('id') id: string, @Res() res: Response) {
        this.users.delete(id);
        res.end();
    }

    @Put(':id')
    update(@Param('id') id: string, @Body("user") user: iUser, @Res() res: Response) {
        this.users.update(id, user);
        res.end();
    }
}
