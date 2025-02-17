import { User } from "./user";
import { Request } from "./Request";

export interface ReqRecv {
    id?: number;
    status: 'รอดำเนินการ'| 'กำลังดำเนินการ' | 'กำลังตรวจสอบเพิ่มเติม' |'ขอข้อมูลเพิ่มเติม' |'อนุมัติ' |'ไม่อนุมัติ' ;
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