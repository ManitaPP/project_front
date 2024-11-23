import { Department } from "./Department";
import { Position } from "./Position";

export interface User {
    userId?: number;
    thaiId: string;
    name: string;
    email: string;
    password: string;
    tel: string;
    role?: string;
    leaderId?: number;
    position?: Position;
    department?: Department;
    positionId?: number | null;
    departmentId?: number | null;
}