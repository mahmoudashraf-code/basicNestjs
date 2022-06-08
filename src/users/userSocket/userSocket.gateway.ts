import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { iUser } from '../users.interface';

@WebSocketGateway({
    cors: {
        origin: "http://127.0.0.1:4200",
        Credential: true,
    },
    namespace: "/user"
})
export class UserSocketGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    constructor(private users: UsersService) { }
    @WebSocketServer() server: Server;

    afterInit(server: Server) {
        server.on("error", (err) => {
            console.warn("Socket");
            console.log(err);
        })
    }

    handleConnection(client: Socket) {
        client.data = (client.request as any).session.user;
        client.data.socketId = client.id;
        this.users.users[client.data.id].socketId = client.id;
        if (client.data.role == 0) {
            client.join("adminRoom");
        } else {
            client.join("userRoom");
        }
    }

    handleDisconnect(client: Socket) {
        delete this.users.users[client.data.id].socketId;
    }

    async isLogin(user: iUser) {
        let sockets = await this.server.fetchSockets();
        for (let i = 0; i < sockets.length; i++) {
            if (sockets[i].data.id == user.id) return true;
        }
        return false;
    }

}