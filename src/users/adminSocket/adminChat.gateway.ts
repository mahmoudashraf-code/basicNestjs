import { WebSocketGateway, WebSocketServer, SubscribeMessage, ConnectedSocket, WsResponse, MessageBody, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { join } from 'path';
import { Server, Socket } from 'socket.io';
import { AppService } from 'src/app.service';
import { iUser } from 'src/users/users.interface';
import { UsersService } from 'src/users/users.service';
import { UserSocketGateway } from 'src/users/userSocket/userSocket.gateway';
import { iChat, iMessage } from './iChat';

@WebSocketGateway({
    namespace: "/user"
})
export class AdminChatGateway implements OnGatewayDisconnect, OnGatewayConnection {
    constructor(private users: UsersService, private app: AppService, private userSocket: UserSocketGateway) { }
    @WebSocketServer() server: Server;

    @SubscribeMessage('[adminChat] getUsers')
    async getAllChatUsers(): Promise<WsResponse<{ [key: string]: iUser }>> {
        return {
            event: "[adminChat] Users",
            data: this.users.users
        };
    }

    async handleConnection(client: Socket) {
        this.server.to("adminRoom").emit("[adminChat] updateState", {
            state: true,
            socketId: client.id,
            id: client.data.id
        });
    }
    async handleDisconnect(client: Socket) {
        this.server.to("adminRoom").emit("[adminChat] updateState", {
            state: false,
            id: client.data.id
        });
    }

    @SubscribeMessage('[adminChat] getChat')
    getChat(@ConnectedSocket() client: Socket, @MessageBody() dest: iUser): WsResponse<iChat> {
        return {
            event: "[adminChat] chat",
            data: this.getChatFile(this.getPath(client.data as iUser, dest))
        };
    }

    @SubscribeMessage('[adminChat] addMessage')
    addM(@ConnectedSocket() client: Socket, @MessageBody("message") message: iMessage, @MessageBody("dest") dest: iUser) {
        let path = this.getPath(client.data as iUser, dest);
        let chat: iChat = this.getChatFile(path);
        chat.room.push(message);
        if (dest.socketId == undefined) {
            chat.flag++;
        } else {
            this.userSocket.server.to(dest.socketId).emit("[chat] addMessage", message.message);
        }
        this.app.file(path).write(chat);
    }

    getPath(src: iUser, dest: iUser) {
        return join("users", dest.id, "chat", `${src.id}.json`);
    }

    getChatFile(path: string): iChat {
        try {
            return this.app.file(path).get();
        } catch (err) {
            return { room: [], flag: 0 }
        }
    }
}
