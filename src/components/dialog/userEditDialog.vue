<script setup lang="ts">
import Swal from "sweetalert2";
import { useUserStore } from "../../stores/user.store";

const userStore = useUserStore();
const cancel = () => {
  userStore.showDialog = false;
};

const editUser = async () => {
  if (userStore.currentUser) {
    userStore.updateUser(userStore.currentUser?.userId, userStore.currentUser);
    userStore.showDialog = false;
    Swal.fire({
      icon: "success",
      title: "แก้ไขข้อมูลสำเร็จ",
      showConfirmButton: false,
      timer: 1500,
    });
    await userStore.getUsers();
  }
};
</script>
<template>
  <v-container>
    <v-card>
      <v-card-title style="text-align: center">แก้ไขข้อมูลผู้ใช้</v-card-title>
      <v-card-text>
        <v-row>
          <v-col col="6"
            ><v-text-field
              label="รหัสบัตรประชาชน"
              variant="solo"
              v-model="userStore.currentUser!.thaiId"
            ></v-text-field
          ></v-col>
        </v-row>
        <v-row>
          <v-col col="6"
            ><v-text-field
              label="ชื่อ-นามสกุล"
              variant="solo"
              v-model="userStore.currentUser!.name"
            ></v-text-field
          ></v-col>
        </v-row>
        <v-row>
          <v-col col="6"
            ><v-text-field
              label="อีเมล"
              variant="solo"
              v-model="userStore.currentUser!.email"
            ></v-text-field
          ></v-col>
        </v-row>
        <v-card-actions>
          <v-btn color="error" @click="cancel()">ยกเลิก</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="editUser()">บันทึก</v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-container>
</template>
