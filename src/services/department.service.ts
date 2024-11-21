import type { Department } from "../stores/types/Department";
import http from "./axios";

function getDepartment() {
    return http.get("/departments");
  }
  function getOneDepartment(id: number) {
    return http.get(`/Departments/${id}`);
  }
  function deleteDepartment(id: number) {
    return http.delete(`/departments/${id}`);
  }
  function updateDepartment(id: number, Department: Department) {
    return http.patch(`/departments/${id}`, Department);
  }
  
  function createDepartment(Department: Department) {
    return http.post("/departments/", Department);
  }

  export default {
    getDepartment,
    deleteDepartment,
    updateDepartment,
    createDepartment,
    getOneDepartment
  };
  



