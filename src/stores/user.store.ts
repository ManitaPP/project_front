import { defineStore } from 'pinia'
import { User } from '../stores/types/user';
import { ref } from 'vue';
import userService from '../services/user.service';
import { useAuthStore } from './auth.store';
import Swal from 'sweetalert2';

export const useUserStore = defineStore("useUserStore", () => {
    const users = ref<User[]>([]);
    const userLeaderNull = ref<User[]>([]);
    const existingThaiIds = ref<string[]>([]);
    const currentUser= ref<User>();
    const showDialog = ref(false);
    const showDialog2 = ref(false);
     const showDialog3 = ref(false);
    const showPositionDialog = ref(false);
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
    const loading = ref(false);

    const getUsers = async () => {
        try {
          const res = await userService.getUser();
          users.value = res.data;
          existingThaiIds.value = users.value.map((user: { thaiId: string }) => user.thaiId);
        } catch (e) {
          console.error("Failed to fetch users:", e);
        }
      };

      const getAllUsers = async () => {
        try {
          const res = await userService.getAllUser();
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
          getUsers();
          Swal.fire({
            icon: "success",
            title: "แก้ไขข้อมูลสำเร็จ",
            showConfirmButton: false,
            timer: 1500,
          });
          // getOneById(id);
        } catch (e) {
          console.error("Failed to fetch users:", e);
        }
      };

      const deleteUser = async (id: number) => {
        try {
          const res = await userService.deleteUser(id);
          currentUser.value = res.data;
          getAllUsers();
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
        } catch (e) {
          console.error("Failed to fetch users:", e);
        }
      };

      const getOneByName = async (name:string) => {
        try {
          const res = await userService.getOneByName(name);
          currentUser.value = res.data;
        } catch (e) {
          console.error("Failed to fetch users:", e);
        }
      };

      
      const searchUsers = async (query:string) => {
        try {
          const res = await userService.searchUsers(query);
          users.value = res.data;
        } catch (e) {
          console.error("Failed to fetch users:", e);
        }
      };

      const updateLeader = async (id:number) => {
        try {
          const res = await userService.updateLeader(id);
          currentUser.value = res.data;
        } catch (e) {
          console.error("Failed to fetch users:", e);
        }
      };
      const reUser = async (id:number) => {
        try {
          const res = await userService.reUser(id);
          currentUser.value = res.data;
          getAllUsers();
        } catch (e) {
          console.error("Failed to fetch users:", e);
        }
      };
      const getLeaderByPriority = async (id:number) => {
        try {
          const res = await userService.getLeaderByPriority(id);
          users.value = res.data;
        } catch (e) {
          console.error("Failed to fetch users:", e);
        }
      };

      
    const getUsersLeaderAllNull = async () => {
      try {
        const res = await userService.getLeaderNull();
        userLeaderNull.value = res.data;
      } catch (e) {
        console.error("Failed to fetch users:", e);
      }
    };


      return { getUsers, createUser, deleteUser, updateUser, users, currentUser,showDialog ,name, email, password, thaiId, getUserByRole, thaiIdError,nameError,passwordError,emailError, tel,telError, getUserByLeader,getPositionByLeader, getOneById,updateLeader,
        getOneByName,existingThaiIds,searchUsers,reUser,getAllUsers,getLeaderByPriority, getUsersLeaderAllNull,userLeaderNull,loading,showPositionDialog, showDialog2, showDialog3
       };
})