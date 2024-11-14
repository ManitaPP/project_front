<script setup lang="ts">
import Swal from "sweetalert2";
import router from "../router";
import { useUserStore } from "../stores/user.store";
import { useAuthStore } from "../stores/auth.store";
import { ref, watch } from "vue";
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
const userStore = useUserStore();
const authStore = useAuthStore();
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
const showPassword = ref(false);
const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};
watch(
  () => userStore.thaiId,
  (newVal) => {
    if (newVal.length !== 13) {
      userStore.thaiIdError = "รหัสบัตรประชาชนต้องมี 13 หลัก";
    }
    if (newVal.length === 0 || newVal.length === 13) {
      userStore.thaiIdError = "";
    }
  }
);
watch(
  () => userStore.name,
  (newVal) => {
    if (newVal.length <= 3) {
      userStore.nameError = "ชื่อ-นามสกุลต้องมีความยาวมากกว่า 3 ตัวอักษร";
    }
    if (newVal.length === 0 || newVal.length > 3) {
      userStore.nameError = "";
    }
  }
);
watch(
  () => userStore.email,
  (newVal) => {
    if (validateEmail(newVal) || newVal.length === 0) {
      userStore.emailError = "";
    } else {
      userStore.emailError = "กรุณากรอกอีเมลให้ถูกต้อง";
    }
  }
);
watch(
  () => userStore.password,
  (newVal) => {
    if (passwordRegex.test(newVal) || newVal.length === 0) {
      userStore.passwordError = "";
    } else {
      userStore.passwordError =
        "รหัสผ่านจะต้องประกอบไปด้วย ตัวอักษร ตัวเลข และตัวอักษรพิเศษ รวมกันทั้งหมดอย่างน้อย 6 ตัวอักษร";
    }
  }
);
const returnToLogin = () => {
  router.push("/login");
  clearData();
};
const saveUser = () => {
  if (
    userStore.name === "" ||
    userStore.email === "" ||
    userStore.password === "" ||
    userStore.thaiId === ""
  ) {
    Swal.fire({
      icon: "error",
      title: "กรุณากรอกข้อมูลให้ครบถ้วน",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }
  if (
    userStore.thaiId.length !== 13 ||
    !validateEmail(userStore.email) ||
    !passwordRegex.test(userStore.password) ||
    userStore.name.length <= 3
  ) {
    Swal.fire({
      icon: "error",
      title: "กรุณากรอกข้อมูลให้ถูกต้อง",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }
  const user = {
    thaiId: userStore.thaiId,
    email: userStore.email,
    password: userStore.password,
    name: userStore.name,
    role: "user",
  };
  console.log(user);
  authStore.registerAdmin(user);
  userStore.thaiId = "";
  userStore.email = "";
  userStore.password = "";
  userStore.name = "";
  router.push("/login");
};
const clearData = () => {
  userStore.nameError = "";
  userStore.emailError = "";
  userStore.passwordError = "";
  userStore.thaiIdError = "";
  userStore.name = "";
  userStore.email = "";
  userStore.password = "";
  userStore.thaiId = "";
};
</script>
<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card style="text-align: center">
          <v-card-title>ลงทะเบียน</v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field
                label="รหัสบัตรประชาชน"
                required
                variant="solo"
                v-model="userStore.thaiId"
                :error-messages="userStore.thaiIdError"
              ></v-text-field>
              <v-text-field
                label="อีเมล"
                required
                variant="solo"
                v-model="userStore.email"
                :error-messages="userStore.emailError"
              ></v-text-field>
              <v-text-field
                label="รหัสผ่าน"
                variant="solo"
                required
                :type="showPassword ? 'text' : 'password'"
                v-model="userStore.password"
                :error-messages="userStore.passwordError"
                ><template #append>
                  <v-icon @click="togglePasswordVisibility">{{
                    showPassword ? "mdi-eye" : "mdi-eye-off"
                  }}</v-icon>
                </template></v-text-field
              >
              <v-text-field
                label="ชื่อ-นามสกุล"
                variant="solo"
                v-model="userStore.name"
                :error-messages="userStore.nameError"
                required
              ></v-text-field>
            </v-form>
            <v-card-actions>
              <v-btn @click="returnToLogin()">ย้อนกลับ</v-btn>
              <v-spacer></v-spacer>
              <v-btn @click="saveUser()">ยืนยัน</v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
