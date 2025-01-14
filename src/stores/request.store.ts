import { defineStore } from 'pinia'
import { Request } from './types/Request';
import RequestService from '../services/Request.service';
import { ref } from 'vue';


export const useRequestStore = defineStore("useRequestStore", () => {
    const Requests = ref<Request[]>([]);
    const currentRequest = ref<Request>();
    const requests = ref("");

   const createRequest = async (request: Request) => {
        try {
            const res = await RequestService.createRequest(request);
            currentRequest.value = res.data;
        } catch (e) {
            console.error("Failed to fetch request:", e);
            }
        }

      return { createRequest , currentRequest , Requests,requests };
})