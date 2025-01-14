import { User } from "./user";

export interface ReqRecv {
    id?: number;
    status: 'รอดำเนินการ'|'กำลังดำเนินการ' |'ขอข้อมูลเพิ่มเติม' |'อนุมัติ' |'ไม่อนุมัติ' ;
    sentAt: Date;
    respondedAt?: Date;
    userId?: number;
    requestId?: number;
    user?: User | null;
    request?: Request | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
}