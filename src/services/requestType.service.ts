import type { RequestType } from "../stores/types/RequestType";
import http from "./axios";

function getRequestType() {
    return http.get("/request-types");
  }
  function getOneRequestType(name: string) {
    return http.get(`/request-types/name/${name}`);
  }

  export default {
    getRequestType,
    getOneRequestType
  };
  



