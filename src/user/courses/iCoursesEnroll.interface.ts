export interface iCoursesEnrollFile {
    [key: string]: iUserEnrollCources;
}
export interface iUserEnrollCources {
    [ket: string]: iUserEnrollCourcesData
}
export interface iUserEnrollCourcesData {
    id: string;
    pass: number;
    total: number;
    stopAt: number;
}
