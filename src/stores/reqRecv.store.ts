import { defineStore } from 'pinia'
import { ReqRecv } from './types/ReqRecv';
import ReqRecvService from '../services/ReqRecv.service';
import { ref } from 'vue';


export const useReqRecvStore = defineStore("useReqRecvStore", () => {
    const ReqRecvs = ref<ReqRecv[]>([]);
    const currentReqRecv = ref<ReqRecv>();

   const createReqRecv = async (ReqRecv: ReqRecv) => {
        try {
            const res = await ReqRecvService.createReqRecv(ReqRecv);
            currentReqRecv.value = res.data;
        } catch (e) {
            console.error("Failed to fetch ReqRecv:", e);
            }
        }

      return { createReqRecv , currentReqRecv , ReqRecvs };
})