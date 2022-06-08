export interface iChat {
    room: iMessage[];
    flag: number;
}
export interface iMessage {
    date: string;
    from: string;
    to: string;
    message: string;
}