export interface iUser {
    id: string;
    email: string;
    password: string;
    name: string;
    img: string;
    phone: string;
    address?: string;
    role: number;
    socketId?: string;
    hostId: string;
}