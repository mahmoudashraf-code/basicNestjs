import { WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { iUser } from 'src/users/users.interface';

@WebSocketGateway({
    cors: {
        origin: "http://127.0.0.1:4200",
        Credential: true,
    },
    namespace: "/usersOfUser"
})
export class UsersOfUserSocketGateway implements OnGatewayConnection {
    constructor() { }
    @WebSocketServer() server: Server;

    handleConnection(client: Socket) {
        client.data = (client.request as any).session.user;
        client.data.socketId = client.id;
        client.join(client.data.hostId);
    }

    async isUserLogin(user: iUser) {
        let sockets = await this.server.in(user.hostId).fetchSockets();
        for (let i = 0; i < sockets.length; i++) {
            if (sockets[i].data.id == user.id) return true;
        }
        return false;
    }
}