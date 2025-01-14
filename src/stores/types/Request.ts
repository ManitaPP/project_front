import { RequestType } from "./RequestType";
import { User } from "./user";

export interface Request {
    id?: number;
    reason: string;
    file?: string;
    reTypeId: number;
    userId: number;
    requestType?: RequestType | null;
    user?: User | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
}