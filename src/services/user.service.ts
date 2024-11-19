import type { User } from "../stores/types/user";
import http from "./axios";

function getUser() {
    return http.get("/users");
  }
  function deleteUser(id: number) {
    return http.delete(`/users/${id}`);
  }
  function updateUser(id: number, User: User) {
    return http.patch(`/users/${id}`, User);
  }
  
  function createUser(User: User) {
    return http.post("/users/", User);
  }
  
  function getUserByEmail(email: string) {
    return http.get(`/users/${email}`);
  }
  function getUserByRole(role: string) {
    return http.get(`/users/${role}`);
  }

  function getUserByLeader(leaderId: number) {
    return http.get(`/users/leader/${leaderId}`);
  }

  export default {
    getUser,
    deleteUser,
    updateUser,
    createUser,
    getUserByEmail,
    getUserByRole,
    getUserByLeader
  };
  



