import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { iUser } from '../../users/users.interface';
import { UsersOfUserService } from './usersOfUser.service';
import { Response } from "express"
import { Roles } from '../../users/role/roles.decorator';
import { Role } from '../../users/role/role.enum';
import { GetUser } from '../../getUser.decorator';

@Controller()
@Roles(Role.User, Role.Admin)
export class UsersOfUserController {
    constructor(private users: UsersOfUserService) { }
    @Post()
    create(@Body("user") userData: iUser, @Res() res: Response, @GetUser() user: iUser) {
        res.json({ id: this.users.createUser(userData, user.id) });
    }
    @Get()
    getAll(@Res() res: Response, @GetUser() user: iUser) {
        res.json(this.users.getAll(user.id))
    }

    @Get(":id")
    get(@Res() res: Response, @Param('id') id: string, @GetUser() user: iUser) {
        res.json(this.users.getAll(user.id)[id]);
    }

    @Delete(':id')
    deleteDir(@Param('id') id: string, @Res() res: Response, @GetUser() user: iUser) {
        let data = this.users.getAll(user.id)
        delete data[id];
        this.users.save(user.id, data);
        res.json();
    }

    @Put(':id')
    update(@Param('id') id: string, @Body("user") userData: iUser, @Res() res: Response, @GetUser() user: iUser) {
        let data = this.users.getAll(user.id)
        data[id] = { ...data[id], ...userData };
        this.users.save(user.id, data);
        res.end();
    }
}
