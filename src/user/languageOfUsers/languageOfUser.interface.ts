export interface iLangugeBodyForUser {
    name: string;
    code: string;
    data: {
        [key: string]: string
    }
}
export interface iAllLanguageDataForUser {
    [key: string]: iLangugeBodyForUser
}