export interface iShortcut {
    [ket: string]: iShortcutData;
}
export interface iShortcutData {
    id: string
    path: string[];
    name: string,
    url: string;
    type: number;
    icon: string;
}
