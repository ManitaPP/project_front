import type { ReqRecv } from "../stores/types/ReqRecv";
import http from "./axios";

function getReqRecv() {
    return http.get("/req-recvs");
  }
  function getOneReqRecv(id: number) {
    return http.get(`/req-recvs/${id}`);
  }
  function deleteReqRecv(id: number) {
    return http.delete(`/req-recvs/${id}`);
  }
  function updateReqRecv(id: number, reqRecv: ReqRecv) {
    return http.patch(`/req-recvs/${id}`, reqRecv);
  }
  
  function createReqRecv(reqRecv: ReqRecv) {
    return http.post("/req-recvs/", reqRecv);
  }

  export default {
    getReqRecv,
    deleteReqRecv,
    updateReqRecv,
    createReqRecv,
    getOneReqRecv
  };
  



