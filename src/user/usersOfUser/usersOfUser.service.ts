import { Injectable, NotAcceptableException, UseGuards } from '@nestjs/common';
import { join } from 'path';
import { SessionGuard } from 'src/session.guard';
import { AppService } from '../../app.service';
import { iUser } from '../../users/users.interface';

@Injectable()
@UseGuards(SessionGuard)
export class UsersOfUserService {
    constructor(private app: AppService) { }
    findOne(userId: string, username: string, password: string): iUser | null {
        let users = this.getAll(userId);
        for (const user in users) {
            const element = users[user];
            if (element.username == username && element.password == password) return element;
        }
        return null;
    }
    getAll(userId: string) {
        return this.app.file(join("users", userId, "users.json")).get();
    }
    save(userId: string, users: { [ket: string]: iUser }) {
        this.app.file(join("users", userId, "users.json")).write(users);
    }
    createUser(user: iUser, hostId: string) {
        user.id = this.app.getRndString();
        user.hostId = hostId;
        user.img = "user.png";
        user.role = 2;
        let data = this.getAll(hostId);
        if (data[user.id] != undefined)
            throw new NotAcceptableException("username not uniqe");
        data[user.id] = user;
        this.save(hostId, data);
        return user;
    }
}