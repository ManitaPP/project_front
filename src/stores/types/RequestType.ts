export interface RequestType {
    id?: number;
    name: string;
    type?: string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
}