import type { User } from "../stores/types/user";
import http from "./axios";

function getUser() {
    return http.get("/users");
  }

  function getAllUser() {
    return http.get("/users/findAll");
  }
  function getOneUser(id: number) {
    return http.get(`/users/${id}`);
  }

  function searchUsers(query: string) {
    return http.get(`/users/search/${query}`);
  }
  function getOneByName(name: string) {
    return http.get(`/users/name/${name}`);
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

  function reUser(id:number) {
    return http.post(`/users/${id}/restore`);
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

  function getPositionByLeader(leaderId: number) {
    return http.get(`/users/position/${leaderId}`);
  }

  function  updateLeader(leaderId: number) {
    return http.patch(`/users/updateLeader/${leaderId}`);
  }

  function getLeaderByPriority(id: number) {
    return http.get(`/users/priority/${id}`);
  }

  function getLeaderNull() {
    return http.get("/users/findAllNullLeader");
  }

  export default {
    getUser,
    deleteUser,
    updateUser,
    createUser,
    getUserByEmail,
    getUserByRole,
    getUserByLeader,
    getPositionByLeader,
    getOneUser,
    updateLeader,
    getOneByName,
    searchUsers,
    reUser,
    getAllUser,
    getLeaderByPriority,
    getLeaderNull
  };
  



