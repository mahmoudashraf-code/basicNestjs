import { Injectable } from '@nestjs/common';
import { UserSocketGateway } from 'src/users/userSocket/userSocket.gateway';
import { iUser } from '../users/users.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(public readonly usersService: UsersService, public userSocket: UserSocketGateway) { }

    validateUser(email: string, pass: string): iUser | null {
        return this.usersService.findOne(email, pass);
    }
}
