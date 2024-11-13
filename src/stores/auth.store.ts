import { defineStore } from 'pinia'
import { ref } from 'vue';
import authService from '../services/auth.service';
import { User } from './types/user';
import router from '../router';

export const useAuthStore = defineStore("authStore", () => {
    const localUser = ref(JSON.parse(localStorage.getItem("user") || "{}")); 
    const currentUser = ref<User>();

    async function login(email, password) {
      try {
        const res = await authService.login(email, password);
        console.log("res", res.data);
        if (res.status === 200) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
          localStorage.setItem('token', res.data.access_token);
          currentUser.value = res.data.user;
          router.push("/profile");
          return true;
        }
      } catch (e) {
        console.error("Failed to login:", e);
      }
    }

    function logout() {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      currentUser.value = undefined;
      router.push("/login");
    }
    return { login,currentUser,logout };
});