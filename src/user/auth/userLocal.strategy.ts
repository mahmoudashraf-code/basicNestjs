import { Injectable, NotFoundException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UsersOfUserService } from "../usersOfUser/usersOfUser.service";
import { Request } from "express";
import { UsersService } from "../../users/users.service";

@Injectable()
export class UserLocalStrategy extends PassportStrategy(Strategy, "user") {
    constructor(private usersOfUser: UsersOfUserService, private users: UsersService) {
        super({
            passReqToCallback: true
        })
    }
    async validate(request: Request, username: string, password: string): Promise<any> {
        const user = this.usersOfUser.findOne(request.body.hostId, username, password);
        const admin = this.users.users[request.body.hostId];
        if (!user && admin == undefined) {
            throw new NotFoundException("username or password not valid.");
        }
        if (user)
            return user;
        else return admin;
    }
}