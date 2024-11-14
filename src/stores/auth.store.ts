import { defineStore } from 'pinia'
import { ref } from 'vue';
import authService from '../services/auth.service';
import { User } from './types/user';
import router from '../router';
import Swal from 'sweetalert2';

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
          Swal.fire({
            icon: "success",
            title: "เข้าสู่ระบบสำเร็จ",
            text: `ยินดีต้อนรับเข้าสู่ระบบ ${currentUser?.value?.name}`,
            showConfirmButton: false,
            timer: 1500,
          });
          if(currentUser.value!.role === "user") {
            router.push("/profile");
          }
          if(currentUser.value!.role === "admin") {
            router.push("/userManagement");
          }
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
    const registerUser = async (user:User) => {
      try {
        const res = await authService.registerUser(user);
        console.log("res regis", res.data);
        currentUser.value = res.data;
      } catch (e) {
        console.error("Failed to fetch users:", e);
      }
    };

    const registerAdmin = async (user:User) => {
      try {
        const res = await authService.registerAdmin(user);
        console.log("res regisAd", res.data);
        currentUser.value = res.data;
      } catch (e) {
        console.error("Failed to fetch users:", e);
      }
    };

    return { login,currentUser,logout ,registerUser,registerAdmin};
});