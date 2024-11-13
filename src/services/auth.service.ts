import type { User } from "../stores/types/user";
import http from "./axios";
function login(user:User) {
  return http.post("/auth/login", user);
}
export default { login };