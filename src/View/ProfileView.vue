<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import HeaderView from "../components/header/headerView.vue";
import SubHeaderView from "../components/header/subHeaderView.vue";
import { useAuthStore } from "../stores/auth.store";
import { useUserStore } from "../stores/user.store";
import Swal from "sweetalert2";

const authStore = useAuthStore();
const userStore = useUserStore();
const user = computed(() => authStore.currentUser);
if (user.value) {
  userStore.currentUser = user.value;
}
onMounted(async () => {
  await userStore.getOneById(userStore.currentUser!.userId!);
});
// const cancel = async () => {
//   await userStore.getOneById(userStore.currentUser!.userId!);
//   userStore.nameError = "";
//   userStore.emailError = "";
//   userStore.telError = "";
//   userStore.thaiIdError = "";
// };

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
  () => userStore.currentUser?.tel,
  (newVal) => {
    if (newVal && !/^0\d{9}$/.test(newVal)) {
      userStore.telError = "เบอร์โทรศัพท์ต้องมี 10 หลัก";
    }
    if (newVal && newVal.length === 10) {
      userStore.telError = "";
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

const editUser = async () => {
  if (
    userStore.thaiIdError ||
    userStore.nameError ||
    userStore.telError ||
    userStore.emailError
  ) {
    Swal.fire({
      icon: "error",
      title: "กรุณากรอกข้อมูลให้ถูกต้อง",
    });
    await userStore.getOneById(userStore.currentUser!.userId!);
    return;
  }
  Swal.fire({
    title: "ยืนยันการแก้ไขข้อมูล",
    text: "คุณต้องการแก้ไขข้อมูลใช่หรือไม่",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "ใช่",
    cancelButtonText: "ไม่ใช่",
  }).then(async (result) => {
    if (result.isConfirmed) {
      userStore.updateUser(userStore.currentUser!.userId!, userStore.currentUser!);
      Swal.fire({
        icon: "success",
        title: "แก้ไขข้อมูลสำเร็จ",
        showConfirmButton: false,
        timer: 1500,
      });
      await userStore.getOneById(userStore.currentUser!.userId!);
    }
  });
};
</script>

<template>
  <HeaderView />
  <v-container>
    <SubHeaderView style="position: absolute; top: 0; left: 0; z-index: 1" />
    <v-row>
      <v-col>
        <v-card
          class="glass-card styled-scrollbar"
          style="overflow-y: auto; max-height: 80vh"
        >
          <v-card-title style="text-align: center">ข้อมูลผู้ใช้</v-card-title>
          <v-card-text>
            <v-row>
              <v-col col="6" align="center">
                <v-img src="/public/profile.png" width="300" height="300"></v-img>
              </v-col>
              <v-col col="6">
                <v-row justify="center">
                  <v-col
                    ><v-text-field
                      label="รหัสบัตรประชาชน"
                      variant="solo"
                      rounded
                      disabled
                      prepend-icon="mdi-card-account-details"
                      :error-messages="userStore.thaiIdError"
                      v-model="userStore.currentUser!.thaiId"
                    ></v-text-field
                  ></v-col>
                </v-row>
                <v-row justify="center">
                  <v-col
                    ><v-text-field
                      label="ชื่อ-นามสกุล"
                      variant="solo"
                      rounded
                      prepend-icon="mdi-account-circle"
                      :error-messages="userStore.nameError"
                      v-model="userStore.currentUser!.name"
                    ></v-text-field
                  ></v-col>
                </v-row>
                <v-row justify="center">
                  <v-col
                    ><v-text-field
                      label="เบอร์โรศัพท์"
                      variant="solo"
                      rounded
                      prepend-icon="mdi-phone"
                      :error-messages="userStore.telError"
                      v-model="userStore.currentUser!.tel"
                    ></v-text-field
                  ></v-col>
                </v-row>
                <v-row justify="center">
                  <v-col
                    ><v-text-field
                      label="อีเมล"
                      variant="solo"
                      rounded
                      prepend-icon="mdi-email"
                      :error-messages="userStore.emailError"
                      v-model="userStore.currentUser!.email"
                    ></v-text-field
                  ></v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-card-actions style="justify-content: center">
              <!-- <v-btn variant="flat" size="large" rounded color="error" @click="cancel()"
                >ยกเลิก</v-btn
              >
              <v-spacer></v-spacer> -->
              <v-btn
                variant="flat"
                size="large"
                rounded
                color="primary"
                @click="editUser()"
                >บันทึกข้อมูล</v-btn
              >
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped></style>
