import { defineStore } from 'pinia'
import { Position } from './types/Position';
import { ref } from 'vue';
import positionService from '../services/position.service';

export const usePositionStore = defineStore("usePositionStore", () => {
    const positions = ref<Position[]>([]);
    const currentPosition = ref<Position>();
    const namePosition = ref('');
    const description = ref('');
    const priority = ref(1);

    const getPositions = async () => {
        try {
            const res = await positionService.getPosition();
            positions.value = res.data;
        } catch (e) {
            console.error("Failed to fetch positions:", e);
            }
        }

    const createPosition = async (position:Position) => {
       try {
            const res = await positionService.createPosition(position);
            currentPosition.value = res.data;
            console.log("Position created:", currentPosition.value);
       }
         catch (e) {
                console.error("Failed to fetch positions:", e);
         }
    }
      return { getPositions, createPosition, positions, currentPosition, namePosition, description,priority };
})