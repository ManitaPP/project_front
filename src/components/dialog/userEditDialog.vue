<script setup lang="ts">
import Swal from "sweetalert2";
import { useUserStore } from "../../stores/user.store";
import { ref, watch } from "vue";

const userStore = useUserStore();
const cancel = async () => {
  userStore.showDialog = false;
  await userStore.getUsers();
  userStore.nameError = "";
  userStore.emailError = "";
  userStore.thaiIdError = "";
};
const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};
watch(
  () => userStore.currentUser?.thaiId,
  (newVal) => {
    if (newVal && newVal.length !== 13) {
      userStore.thaiIdError = "รหัสบัตรประชาชนต้องมี 13 หลัก";
    }
    if (newVal && newVal.length === 13) {
      userStore.thaiIdError = "";
    }
  }
);
watch(
  () => userStore.currentUser?.name,
  (newVal) => {
    if (newVal && newVal.length <= 3) {
      userStore.nameError = "ชื่อ-นามสกุลต้องมีความยาวมากกว่า 3 ตัวอักษร";
    }
    if (newVal && newVal.length > 3) {
      userStore.nameError = "";
    }
  }
);
watch(
  () => userStore.currentUser?.email,
  (newVal) => {
    if (newVal && validateEmail(newVal)) {
      userStore.emailError = "";
    }
    if (newVal && !validateEmail(newVal)) {
      userStore.emailError = "กรุณากรอกอีเมลให้ถูกต้อง";
    }
  }
);

const clearMessage = () => {
  userStore.nameError = "";
  userStore.emailError = "";
  userStore.thaiIdError = "";
};
const editUser = async () => {
  if (userStore.currentUser) {
    // if (
    //   userStore.currentUser.thaiId.length !== 13 ||
    //   userStore.currentUser.name.length <= 3 ||
    //   !validateEmail(userStore.currentUser.email)
    // ) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "ไม่สามารถแก้ไขได้",
    //     showConfirmButton: false,
    //     timer: 1500,
    //   });
    //   userStore.getUsers();
    //   clearMessage();
    //   userStore.showDialog = false;
    // }
    userStore.updateUser(userStore.currentUser?.userId!, userStore.currentUser);
    userStore.showDialog = false;
    Swal.fire({
      icon: "success",
      title: "แก้ไขข้อมูลสำเร็จ",
      showConfirmButton: false,
      timer: 1500,
    });
  }
};
</script>
<template>
  <v-container align="center" justify="center">
    <v-card style="width: 50%">
      <v-card-title style="text-align: center">แก้ไขข้อมูลผู้ใช้</v-card-title>
      <v-card-text>
        <v-row>
          <v-col col="6"
            ><v-text-field
              label="รหัสบัตรประชาชน"
              variant="solo"
              prepend-icon="mdi-card-account-details"
              :error-messages="userStore.thaiIdError"
              v-model="userStore.currentUser!.thaiId"
            ></v-text-field
          ></v-col>
        </v-row>
        <v-row>
          <v-col col="6"
            ><v-text-field
              label="ชื่อ-นามสกุล"
              variant="solo"
              prepend-icon="mdi-account-circle"
              :error-messages="userStore.nameError"
              v-model="userStore.currentUser!.name"
            ></v-text-field
          ></v-col>
        </v-row>
        <v-row>
          <v-col col="6"
            ><v-text-field
              label="เบอร์โรศัพท์"
              variant="solo"
              prepend-icon="mdi-phone"
              :error-messages="userStore.telError"
              v-model="userStore.currentUser!.tel"
            ></v-text-field
          ></v-col>
        </v-row>
        <v-row>
          <v-col col="6"
            ><v-text-field
              label="อีเมล"
              variant="solo"
              prepend-icon="mdi-email"
              :error-messages="userStore.emailError"
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
