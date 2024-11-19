export interface User {
    userId?: number;
    thaiId: string;
    name: string;
    email: string;
    password: string;
    tel: string;
    role?: string;
    position?: string;
    leaderId?: number;
}