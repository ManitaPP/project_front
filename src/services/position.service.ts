import type { Position } from "../stores/types/Position";
import http from "./axios";

function getPosition() {
    return http.get("/positions");
  }
  function getOnePosition(id: number) {
    return http.get(`/positions/${id}`);
  }
  function deletePosition(id: number) {
    return http.delete(`/positions/${id}`);
  }
  function updatePosition(id: number, Position: Position) {
    return http.patch(`/positions/${id}`, Position);
  }
  
  function createPosition(Position: Position) {
    return http.post("/positions/", Position);
  }

  export default {
    getPosition,
    deletePosition,
    updatePosition,
    createPosition,
    getOnePosition
  };
  



