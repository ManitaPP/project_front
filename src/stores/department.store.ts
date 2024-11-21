import { defineStore } from 'pinia'
import { ref } from 'vue';
import departmentService from '../services/department.service';
import { Department } from './types/Department';

export const useDepartmentStore = defineStore("useDepartmentStore", () => {
    const departments = ref<Department[]>([]);
    const currentDepartment = ref<Department>();
    const nameDepartment = ref('');
    const description = ref('');

    const getDepartments = async () => {
        try {
            const res = await departmentService.getDepartment();
            departments.value = res.data;
        } catch (e) {
            console.error("Failed to fetch departments:", e);
            }
        }

    const createDepartment = async (department:Department) => {
       try {
            const res = await departmentService.createDepartment(department);
            currentDepartment.value = res.data;
       }
         catch (e) {
                console.error("Failed to fetch departments:", e);
         }
    }
      return { getDepartments, createDepartment, departments, description ,currentDepartment, nameDepartment };
})