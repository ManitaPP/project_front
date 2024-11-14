import { User } from "../stores/types/user";
import http from "./axios";
function login(email: string, password: string) {
  return http.post("/auth/login", { email, password });
}

function registerUser(user:User) {
  return http.post("/auth/registerUser", user);
}
function registerAdmin(user:User) {
  return http.post("/auth/registerAdmin", user);
}
export default { login,registerUser,registerAdmin };