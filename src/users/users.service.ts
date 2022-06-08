import { Injectable, NotAcceptableException } from '@nestjs/common';
import { mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import { AppService } from '../app.service';
import { iUser } from './users.interface';
@Injectable()
export class UsersService {
    users: { [key: string]: iUser } = {};
    constructor(private app: AppService) {
        this.init();
    }
    private init() {
        this.users = this.app.file("users.json").get();
    }
    findOne(email: string, password: string): iUser | null {
        for (const user in this.users) {
            const element = this.users[user];
            if (element.email == email && element.password == password) return element;
        }
        return null;
    }
    getAll() {
        return this.users;
    }
    delete(id: string) {
        if (!this.users.hasOwnProperty(id))
            throw new NotAcceptableException("username not found")
        delete this.users[id];
        this.save();
        rmSync(join(this.app.path, "users", id), { recursive: true });
    }
    update(id: string, user: iUser) {
        user = { ...this.users[id], ...user }
        if (!this.users.hasOwnProperty(user.id))
            throw new NotAcceptableException("username not found")
        this.users[id] = user;
        this.save();
    }
    create(user: iUser) {
        user.id = this.app.getRndString();
        user.hostId = user.id;
        user.role = 1;
        if (this.users.hasOwnProperty(user.id))
            throw new NotAcceptableException("username not uniqe")
        user.img = "user.png";
        this.users[user.id] = user;
        this.save();
        let path = join(this.app.path, "users", user.id)
        mkdirSync(path);
        mkdirSync(join(path, "explorer"));
        mkdirSync(join(path, "language"));
        this.app.file(join("users", user.id, "users.json")).write({});
        this.app.file(join("users", user.id, "website.json")).write([]);
        this.app.file(join("users", user.id, "shortcut.json")).write([]);
        this.app.file(join("users", user.id, "coursesEnroll.json")).write([]);
        return user;
    }
    save() {
        this.app.file("users.json").write(this.users);
    }
}