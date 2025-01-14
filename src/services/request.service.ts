import type { Request } from "../stores/types/Request";
import http from "./axios";

function getRequest() {
    return http.get("/user-requests");
  }
  function getOneRequest(id: number) {
    return http.get(`/user-requests/${id}`);
  }
  function deleteRequest(id: number) {
    return http.delete(`/user-requests/${id}`);
  }
  function updateRequest(id: number, request: Request) {
    return http.patch(`/user-requests/${id}`, request);
  }
  
  function createRequest(request: Request) {
    return http.post("/user-requests/", request);
  }

  export default {
    getRequest,
    deleteRequest,
    updateRequest,
    createRequest,
    getOneRequest
  };
  



