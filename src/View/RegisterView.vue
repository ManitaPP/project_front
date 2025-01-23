<script setup lang="ts">
import Swal from "sweetalert2";
import router from "../router";
import { useUserStore } from "../stores/user.store";
import { useAuthStore } from "../stores/auth.store";
import { onMounted, ref, watch } from "vue";

const userStore = useUserStore();
const authStore = useAuthStore();
const showPassword = ref(false);
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};
onMounted(async () => {
  await userStore.getUsers();
});
watch(
  () => userStore.thaiId,
  async (newVal) => {
    const thaiIdRegex = /^\d{13}$/;
    const isUnique = await checkThaiIdUniqueness(newVal);
    if (!thaiIdRegex.test(newVal)) {
      userStore.thaiIdError = "รหัสบัตรประชาชนต้องเป็นตัวเลข 13 หลักเท่านั้น";
      return;
    }
    if (!isUnique) {
      userStore.thaiIdError = "รหัสบัตรประชาชนนี้มีอยู่ในระบบแล้ว";
    } else {
      userStore.thaiIdError = "";
    }
  }
);
watch(
  () => userStore.name,
  (newVal) => {
    const thaiRegex = /^[ก-๙\s]+$/;

    if (newVal.length <= 3) {
      userStore.nameError = "ชื่อ-นามสกุลต้องมีความยาวมากกว่า 3 ตัวอักษร";
    } else if (newVal.length > 0 && !thaiRegex.test(newVal)) {
      userStore.nameError = "กรุณากรอกชื่อ-นามสกุลเป็นภาษาไทยเท่านั้น";
    } else {
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

watch(
  () => userStore.tel,
  (newVal) => {
    const phoneRegex = /^0\d{9}$/;

    if (newVal && !phoneRegex.test(newVal)) {
      userStore.telError = "เบอร์โทรศัพท์ต้องเป็นตัวเลขและเริ่มต้นด้วย 0 มี 10 หลัก";
    } else {
      userStore.telError = "";
    }
  }
);
const returnToLogin = () => {
  router.push("/login");
  clearData();
};
const checkThaiIdUniqueness = async (id: string): Promise<boolean> => {
  return !userStore.existingThaiIds.includes(id);
};

const clearData = () => {
  userStore.nameError = "";
  userStore.emailError = "";
  userStore.passwordError = "";
  userStore.thaiIdError = "";
  userStore.telError = "";
  userStore.name = "";
  userStore.email = "";
  userStore.password = "";
  userStore.tel = "";
  userStore.thaiId = "";
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
const saveUser = () => {
  if (
    userStore.name === "" ||
    userStore.email === "" ||
    userStore.password === "" ||
    userStore.thaiId === "" ||
    userStore.tel === ""
  ) {
    Swal.fire({
      icon: "error",
      title: "กรุณากรอกข้อมูลให้ครบถ้วน",
      showConfirmButton: false,
      timer: 1500,
    });
    clearData();
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
    clearData();
    return;
  }
  const user = {
    thaiId: userStore.thaiId,
    email: userStore.email,
    password: userStore.password,
    name: userStore.name,
    tel: userStore.tel,
  };
  authStore.registerUser(user);
  clearData();
  router.push("/login");
};
</script>
<template>
  <v-container fluid class="register-page"  style="height: 100vh;background-color: #23486A;">
    <v-row>
      <v-col cols="12" sm="8" md="6">
        <v-card style="text-align: center;border-radius: 16px;">
          <v-card-title align="center">
            <v-img src="/public/sign-in.png" height="100" width="100" contain></v-img
          ></v-card-title>
          <v-card-text>
            <v-text-field
              label="รหัสบัตรประชาชน"
              required
              rounded
              variant="outlined"
              prepend-icon="mdi-card-account-details"
              :error-messages="userStore.thaiIdError"
              v-model="userStore.thaiId"
            ></v-text-field>
            <v-row>
              <v-col>
                <v-text-field
                  label="ชื่อ-นามสกุล"
                  variant="outlined"
                  rounded
                  prepend-icon="mdi-account-circle"
                  :error-messages="userStore.nameError"
                  v-model="userStore.name"
                  required
                ></v-text-field
              ></v-col>
              <v-col>
                <v-text-field
                  label="เบอร์โทรศัพท์"
                  variant="outlined"
                  rounded
                  prepend-icon="mdi-phone"
                  :error-messages="userStore.telError"
                  v-model="userStore.tel"
                  required
                ></v-text-field
              ></v-col>
            </v-row>
            <v-text-field
              label="อีเมล"
              required
              rounded
              variant="outlined"
              prepend-icon="mdi-email"
              :error-messages="userStore.emailError"
              v-model="userStore.email"
            ></v-text-field>
            <v-text-field
              label="รหัสผ่าน"
              variant="outlined"
              required
              rounded
              prepend-icon="mdi-lock"
              v-model="userStore.password"
              :error-messages="userStore.passwordError"
              :type="showPassword ? 'text' : 'password'"
            >
              <template #append>
                <v-icon @click="togglePasswordVisibility">
                  {{ showPassword ? "mdi-eye" : "mdi-eye-off" }}
                </v-icon>
              </template>
            </v-text-field>
            <v-card-actions>
              <v-btn
                variant="flat"
                size="large"
                rounded
                @click="returnToLogin()"
                color="#D3F1DF"
                >ย้อนกลับ</v-btn
              >
              <v-spacer></v-spacer>
              <v-btn
                variant="flat"
                size="large"
                rounded
                @click="saveUser()"
                color="#A888B5"
                >ยืนยัน</v-btn
              >
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-col>
      <v-row class="flex-column justify-center align-center">
        <v-img
          src="/public/welcome.png"
          height="150"
          width="150"
          contain
          class="welcome-back-animation"
        >
        </v-img>
        <v-img src="/public/account-login.png" height="300" width="300" contain></v-img>
      </v-row>
    </v-row>
  </v-container>
</template>

<style>
.register-page .v-text-field .v-input__append {
  position: absolute;
  transform: translateY(70%);
  left: 85%;
}
.register-page .welcome-back-animation {
  animation: bounce 2s infinite ease-in-out;
}
@keyframes bounce {
  0%,
  100% {
    transform: translateY(20px);
  }
  50% {
    transform: translateY(0);
  }
}
</style>
