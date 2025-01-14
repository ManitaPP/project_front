import { defineStore } from 'pinia'
import { RequestType } from './types/RequestType';
import requestTypeService from '../services/requestType.service';
import { ref } from 'vue';


export const useRequestTypeStore = defineStore("useRequestTypeStore", () => {
    const requestTypes = ref<RequestType[]>([]);
    const currentRequestType = ref<RequestType>();
    const requests = ref("");

    const getRequestTypeByName = async (name: string) => {
        try {
            const res = await requestTypeService.getOneRequestType(name);
            requestTypes.value = res.data;
        } catch (e) {
            console.error("Failed to fetch positions:", e);
            }
        }

        const getRequestType = async () => {
            try {
                const res = await requestTypeService.getRequestType();
                requestTypes.value = res.data;
            } catch (e) {
                console.error("Failed to fetch positions:", e);
                }
            }

      return { getRequestTypeByName, currentRequestType , getRequestType, requestTypes,requests };
})