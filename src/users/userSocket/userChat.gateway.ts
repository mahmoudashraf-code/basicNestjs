import { WebSocketGateway, WebSocketServer, SubscribeMessage, ConnectedSocket, WsResponse, MessageBody } from '@nestjs/websockets';
import { join } from 'path';
import { Server, Socket } from 'socket.io';
import { iChat, iMessage } from 'src/users/adminSocket/iChat';
import { AppService } from 'src/app.service';
import { UsersOfUserService } from 'src/user/usersOfUser/usersOfUser.service';
import { UsersOfUserSocketGateway } from 'src/users/usersOfUserSocket/userSocket.gateway';
import { iUser } from 'src/users/users.interface';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({
    namespace: "/user"
})
export class UserChatGateway {
    constructor(private usersOfUser: UsersOfUserService, private app: AppService, private usersOfUserSocket: UsersOfUserSocketGateway, private users: UsersService) { }
    @WebSocketServer() server: Server;

    @SubscribeMessage('[chat] getUsers')
    async getAllChatUsers(@ConnectedSocket() client: Socket): Promise<WsResponse<{ [key: string]: iUser }>> {
        return {
            event: "[chat] Users",
            data: await this.getUsers(client.data)
        };
    }

    @SubscribeMessage('[chat] getChat')
    getChat(@ConnectedSocket() client: Socket, @MessageBody() dest: iUser): WsResponse<iChat> {
        return {
            event: "[chat] chat",
            data: this.getChatFile(this.getPath(client.data as iUser, dest))
        };
    }

    @SubscribeMessage('[chat] addMessage')
    addM(@ConnectedSocket() client: Socket, @MessageBody("message") message: iMessage, @MessageBody("dest") dest: iUser) {
        let path = this.getPath(client.data as iUser, dest);
        let chat: iChat = this.getChatFile(path);
        chat.room.push(message);
        switch (dest.role) {
            case 0:
                this.server.in("adminRoom").emit("[adminChat] addMessage", message.message);
                break;
            default:
                this.usersOfUserSocket.server.to(dest.socketId).emit("[chat] addMessage", message.message);
                break;
        }
        this.app.file(path).write(chat);
    }

    getPath(src: iUser, dest: iUser) {
        return join("users", src.id, "chat", `${dest.id}.json`);
    }

    getChatFile(path: string): iChat {
        try {
            return this.app.file(path).get();
        } catch (err) {
            return { room: [], flag: 0 }
        }
    }

    async getUsers(user: iUser): Promise<{ [key: string]: iUser; }> {
        let users = this.usersOfUser.getAll(user.id);
        users["_5252265154@555"] = { ...this.users.users["_5252265154@555"] };
        delete users["_5252265154@555"].socketId;
        return users;
    }
}
