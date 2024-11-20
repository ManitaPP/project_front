import { defineStore } from 'pinia'
import { User } from '../stores/types/user';
import { ref } from 'vue';
import userService from '../services/user.service';
import { useAuthStore } from './auth.store';

export const useUserStore = defineStore("useUserStore", () => {
    const users = ref<User[]>([]);
    const currentUser= ref<User>();
    const showDialog = ref(false);
    const authStore = useAuthStore();
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const thaiId = ref('');
    const tel = ref('');
    const telError = ref('');
    const nameError = ref('');
    const emailError = ref('');
    const passwordError = ref('');
    const thaiIdError = ref('');

    const getUsers = async () => {
        try {
          const res = await userService.getUser();
          users.value = res.data;
        } catch (e) {
          console.error("Failed to fetch users:", e);
        }
      };

      const createUser = async (user:User) => {
        try {
          const res = await userService.createUser(user);
          currentUser.value = res.data;
        } catch (e) {
          console.error("Failed to fetch users:", e);
        }
      };

      const updateUser = async (id: number,user:User) => {
        try {
          const res = await userService.updateUser(id,user);
          currentUser.value = res.data;
          getOneById(id);
        } catch (e) {
          console.error("Failed to fetch users:", e);
        }
      };

      const deleteUser = async (id: number) => {
        try {
          const res = await userService.deleteUser(id);
          currentUser.value = res.data;
          getUsers();
        } catch (e) {
          console.error("Failed to fetch users:", e);
        }
      };

      const getUserByRole = async (role:string) => {
        try {
          const res = await userService.getUserByRole(role);
          users.value = res.data;
        } catch (e) {
          console.error("Failed to fetch users:", e);
        }
      };

      const getUserByLeader = async (leaderId:number) => {
        try {
          const res = await userService.getUserByLeader(leaderId);
          users.value = res.data;
        } catch (e) {
          console.error("Failed to fetch users:", e);
        }
      };

      const getPositionByLeader = async (leaderId:number) => {
        try {
          const res = await userService.getPositionByLeader(leaderId);
          users.value = res.data;
        } catch (e) {
          console.error("Failed to fetch users:", e);
        }
      };

      const getOneById = async (id:number) => {
        try {
          const res = await userService.getOneUser(id);
          currentUser.value = res.data;
          if(currentUser.value) {
            authStore.currentUser = currentUser.value;
          }
          console.log("1",currentUser.value);
          console.log("2",authStore.currentUser);
        } catch (e) {
          console.error("Failed to fetch users:", e);
        }
      };

      return { getUsers, createUser, deleteUser, updateUser, users, currentUser,showDialog ,name, email, password, thaiId, getUserByRole, thaiIdError,nameError,passwordError,emailError, tel,telError, getUserByLeader,getPositionByLeader, getOneById };
})