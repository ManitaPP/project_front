import { defineStore } from 'pinia'
import { User } from '../stores/types/user';
import { ref } from 'vue';
import userService from '../services/user.service';

export const useUserStore = defineStore("userStore", () => {
    const users = ref<User[]>([]);
    const currentUser= ref<User>();

    const getUsers = async () => {
        try {
          const res = await userService.getUser();
          console.log("res", res.data);
          users.value = res.data;
        } catch (e) {
          console.error("Failed to fetch users:", e);
        }
      };

      const createUser = async (user:User) => {
        try {
          const res = await userService.createUser(user);
          console.log("res", res.data);
          currentUser.value = res.data;
        } catch (e) {
          console.error("Failed to fetch users:", e);
        }
      };

      const updateUser = async (id: number,user:User) => {
        try {
          const res = await userService.updateUser(id,user);
          console.log("res", res.data);
          currentUser.value = res.data;
        } catch (e) {
          console.error("Failed to fetch users:", e);
        }
      };

      const deleteUser = async (id: number) => {
        try {
          const res = await userService.deleteUser(id);
          console.log("res", res.data);
          currentUser.value = res.data;
        } catch (e) {
          console.error("Failed to fetch users:", e);
        }
      };

      return { getUsers, createUser, deleteUser, updateUser, users, currentUser };
})