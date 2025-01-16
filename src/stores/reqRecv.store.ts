import { defineStore } from 'pinia'
import { ReqRecv } from './types/ReqRecv';
import { ref } from 'vue';
import reqRecvService from '../services/reqRecv.service';


export const useReqRecvStore = defineStore("useReqRecvStore", () => {
    const ReqRecvs = ref<ReqRecv[]>([]);
    const currentReqRecv = ref<ReqRecv>();
    const showDialog = ref(false);
    const reqId = ref(0);
    const statusReq = ref("");

   const createReqRecv = async (ReqRecv: ReqRecv) => {
        try {
            const res = await reqRecvService.createReqRecv(ReqRecv);
            currentReqRecv.value = res.data;
        } catch (e) {
            console.error("Failed to fetch ReqRecv:", e);
            }
        }
    const getOneByReqRecv = async (id:number) => {
        try {
            const res = await reqRecvService.getOneReqRecv(id);
            currentReqRecv.value = res.data;
        } catch (e) {
            console.error("Failed to fetch positions:", e);
            }
        }

    const getReqRecvByUser = async (id: number) => {
        try {
            const res = await reqRecvService.getReqRecvByUserId(id);
            ReqRecvs.value = res.data;
        } catch (e) {
            console.error("Failed to fetch ReqRecv:", e);
            }
        }  
        
    const getReceiverByUser = async (id: number) => {
        try {
            const res = await reqRecvService.getReceiverByUser(id);
            ReqRecvs.value = res.data;
        } catch (e) {
            console.error("Failed to fetch ReqRecv:", e);
            }
        }    

    const updateReceived = async (id: number, status: string) => {
        try {
            const res = await reqRecvService.updateStatus(id, status);
            currentReqRecv.value = res.data;
        } catch (e) {
            console.error("Failed to fetch ReqRecv:", e);
            }
        }

    const updateRespondedRequest = async (id: number, respondedAt: Date) => {
        try {
            const res = await reqRecvService.updateRespondedRequest(id, respondedAt);
            currentReqRecv.value = res.data;
        } catch (e) {
            console.error("Failed to fetch ReqRecv:", e);
            }
        }

    return { createReqRecv , currentReqRecv , ReqRecvs, getReqRecvByUser, getReceiverByUser, showDialog, getOneByReqRecv, reqId , updateReceived, updateRespondedRequest };
})