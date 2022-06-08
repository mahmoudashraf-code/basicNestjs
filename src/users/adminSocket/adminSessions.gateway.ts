import { WebSocketGateway, WsResponse, MessageBody, SubscribeMessage, WebSocketServer, OnGatewayDisconnect, OnGatewayConnection } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { iUser } from 'src/users/users.interface';

@WebSocketGateway({
    namespace: "/user"
})

export class AdminSessionsGateway implements OnGatewayDisconnect, OnGatewayConnection {
    constructor() { }
    @WebSocketServer() server: Server;

    @SubscribeMessage('[adminSession] getConnectUsers')
    async getAllConnectedUsers(): Promise<WsResponse<iUser[]>> {
        return {
            event: "[adminSession] connectUsers",
            data: await this.sendUsers()
        };
    }

    async handleConnection() {
        this.server.to("adminRoom").emit("[adminSession] connectUsers", await this.sendUsers());
    }
    async handleDisconnect() {
        this.server.to("adminRoom").emit("[adminSession] connectUsers", await this.sendUsers());
    }

    @SubscribeMessage('[adminSession] closeSession')
    reciveMessage(@MessageBody() data: { sessionId: string }) {
        this.server.to(data.sessionId).emit(`[adminSession] closeSession`)
    }

    async sendUsers() {
        let sockets = await this.server.fetchSockets();
        let users: iUser[] = [];
        sockets.forEach(ele => {
            ele.data.socketId = ele.id;
            users.push(ele.data);
        })
        return users;
    }
}
