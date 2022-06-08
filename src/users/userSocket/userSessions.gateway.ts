import { WebSocketGateway, WsResponse, MessageBody, SubscribeMessage, WebSocketServer, OnGatewayInit, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsersOfUserSocketGateway } from 'src/users/usersOfUserSocket/userSocket.gateway';
import { iUser } from 'src/users/users.interface';
import { UsersService } from '../users.service';

@WebSocketGateway({
    namespace: "/user"
})

export class UserSessionsGateway implements OnGatewayInit {
    constructor(private usersOfUserSocket: UsersOfUserSocketGateway, private users: UsersService) { }
    @WebSocketServer() server: Server;

    @SubscribeMessage('[session] getConnectUsers')
    async getAllConnectedUsers(@ConnectedSocket() client: Socket): Promise<WsResponse<iUser[]>> {
        return {
            event: "[session] connectUsers",
            data: await this.sendUsers(client.data)
        };
    }

    afterInit() {
        this.usersOfUserSocket.server.on("connection", async (client: Socket) => {
            await this._initToUser(client);
            client.on("disconnect", async () => {
                await this._initToUser(client);
            });
        });
    }

    @SubscribeMessage('[session] closeSession')
    reciveMessage(@MessageBody() data: { sessionId: string }) {
        this.server.to(data.sessionId).emit(`[session] closeSession`)
    }

    async sendUsers(user: iUser) {
        let sockets = await this.usersOfUserSocket.server.in(user.hostId).fetchSockets();
        let users: iUser[] = [];
        sockets.forEach(ele => {
            ele.data.socketId = ele.id;
            users.push(ele.data);
        })
        return users;
    }
    async _initToUser(client: Socket) {
        if (this.users.users[client.data.hostId].socketId == undefined) return;
        this.server.to(this.users.users[client.data.hostId].socketId).emit("[session] connectUsers", await this.sendUsers(client.data));
    }
}
