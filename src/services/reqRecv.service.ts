import type { ReqRecv } from "../stores/types/ReqRecv";
import http from "./axios";

function getReqRecv() {
    return http.get("/req-recvs");
  }
  function getOneReqRecv(id: number) {
    return http.get(`/req-recvs/${id}`);
  }

  function getReqRecvByUserId(id: number) {
    return http.get(`/req-recvs/requests/${id}`);
  }

  function getReceiverByUser(id: number) {
    return http.get(`/req-recvs/users/${id}`);
  }

  function deleteReqRecv(id: number) {
    return http.delete(`/req-recvs/${id}`);
  }

  function updateStatus(id: number, status: string) {
    return http.patch(`/req-recvs/statusRequest/${id}`, {status});
  }

  function updateRespondedRequest(id: number,respondedAt: Date) {
    return http.patch(`/req-recvs/respondedRequest/${id}`, {respondedAt});
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
    updateStatus,
    createReqRecv,
    getOneReqRecv,
    getReqRecvByUserId,
    getReceiverByUser,
    updateRespondedRequest
  };
  



