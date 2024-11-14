import { defineStore } from 'pinia';
import { ref } from 'vue';
import authService from '../services/auth.service';
import { User } from './types/user';
import router from '../router';
import Swal from 'sweetalert2';

export const useAuthStore = defineStore("authStore", () => {
  const localUser = ref<User | null>(JSON.parse(localStorage.getItem("user") || "null")); 
  const currentUser = ref<User | null>(localUser.value);

  async function login(email: string, password: string): Promise<boolean> {
    try {
      const res = await authService.login(email, password);
      if (res.status === 200) {
        const { user, access_token } = res.data;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('authToken', access_token);
        currentUser.value = user;
        Swal.fire({
          icon: "success",
          title: "เข้าสู่ระบบสำเร็จ",
          text: `ยินดีต้อนรับเข้าสู่ระบบ ${currentUser?.value?.name}`,
          showConfirmButton: false,
          timer: 1500,
        });

        if (user.role === "user") {
          router.push("/profile");
        } else if (user.role === "admin") {
          router.push("/userManagement");
        }

        return true;
      }
      return false;
    } catch (e) {
      console.error("Failed to login:", e);
      Swal.fire({
        icon: "error",
        title: "เข้าสู่ระบบล้มเหลว",
        text: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
      });
      return false;
    }
  }

  function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    currentUser.value = null;
    router.push("/login");
    Swal.fire({
      icon: "success",
      title: "ออกจากระบบสำเร็จ",
    });
  }

  const registerUser = async (user: User) => {
    try {
      const res = await authService.registerUser(user);
      currentUser.value = res.data;
      Swal.fire({
        icon: "success",
        title: "ลงทะเบียนสำเร็จ",
        text: `ลงทะเบียนสำเร็จ ${currentUser.value!.name}`,
      });
    } catch (e) {
      console.error("Failed to register user:", e);
      Swal.fire({
        icon: "error",
        title: "ลงทะเบียนล้มเหลว",
        text: "ไม่สามารถลงทะเบียนได้ กรุณาลองใหม่",
      });
    }
  };

  const registerAdmin = async (user: User) => {
    try {
      const res = await authService.registerAdmin(user);
      currentUser.value = res.data;
      Swal.fire({
        icon: "success",
        title: "ลงทะเบียนผู้ดูแลสำเร็จ",
        text: `ผู้ดูแล ${currentUser.value!.name} ได้รับการลงทะเบียน`,
      });
    } catch (e) {
      console.error("Failed to register admin:", e);
      Swal.fire({
        icon: "error",
        title: "ลงทะเบียนผู้ดูแลล้มเหลว",
        text: "ไม่สามารถลงทะเบียนผู้ดูแลได้ กรุณาลองใหม่",
      });
    }
  };

  return { login, currentUser, logout, registerUser, registerAdmin };
});
