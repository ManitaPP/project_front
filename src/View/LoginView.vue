<script lang="ts" setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth.store";
import router from "../router";
import { useUserStore } from "../stores/user.store";

const password = ref("");
const userStore = useUserStore();
const email = ref("");
const authStore = useAuthStore();
const showPassword = ref(false);
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
function summit() {
  authStore.login(email.value, password.value);
  password.value = "";
  email.value = "";
}
function goToRegister() {
  router.push("/register");
  clearData();
}

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
</script>

<!-- <template> -->
<!-- <v-container class="login-page" align="center" justify="center"> -->
<!-- <v-card class="glass-card">
      <v-row>
        <v-col col="auto">
          <v-img
            src="/public/login1.png"
            height="150"
            width="150"
            contain
            class="animated-image"
          ></v-img>
          <v-card-text>
            <v-text-field
              style="width: 80%"
              label="Email"
              required
              variant="outlined"
              rounded
              prepend-icon="mdi-account"
              v-model="email"
            ></v-text-field>
            <v-text-field
              style="width: 80%"
              label="Password"
              variant="outlined"
              required
              rounded
              prepend-icon="mdi-lock"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
            >
              <template #append>
                <v-icon @click="togglePasswordVisibility">
                  {{ showPassword ? "mdi-eye" : "mdi-eye-off" }}
                </v-icon>
              </template>
</v-text-field>
<v-row style="justify-content: center">
  <v-col cols="8">
    <v-btn @click="summit()" size="large" block rounded color="#CDC1FF">เข้าสู่ระบบ</v-btn>
  </v-col>
</v-row>
<v-row justify="center" align="center" class="d-flex">
  <span>ยังไม่มีบัญชีผู้ใช้?</span>
  <v-btn style="color: cornflowerblue; margin-left: -15px" @click="goToRegister()" variant="text" rounded>
    สมัครสมาชิก
  </v-btn>
</v-row>
</v-card-text>
</v-col>
</v-row>
</v-card> -->
<!-- </v-container> -->
<!-- <v-container fill-height>
    <v-row>
      <v-col cols="12" sm="8" md="6">
        <v-card>
            <v-row class="center-content">
              <v-img src="/public/login1.png" height="150" width="150" contain class="animated-image"></v-img>
            </v-row>
            <v-row>
              <v-card-text>
                <v-text-field style="width: 80%" label="Email" required variant="outlined" rounded
                  prepend-icon="mdi-account" v-model="email"></v-text-field>
                  <v-text-field
                  style="width: 80%"
                  label="Password"
                  variant="outlined"
                  required
                  rounded
                  prepend-icon="mdi-lock"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                >
                  <template #append-inner>
                    <v-icon @click="togglePasswordVisibility" class="cursor-pointer">
                      {{ showPassword ? "mdi-eye" : "mdi-eye-off" }}
                    </v-icon>
                  </template>
                </v-text-field>
              </v-card-text>
            </v-row>
            <v-row style="justify-content: center">
              <v-col cols="8">
                <v-btn @click="summit()" size="large" block rounded color="#CDC1FF">เข้าสู่ระบบ</v-btn>
              </v-col>
            </v-row>
            <v-row justify="center" align="center" class="d-flex pa-5">
              <span>ยังไม่มีบัญชีผู้ใช้?</span>
              <v-btn style="color: cornflowerblue; margin-left: -15px" @click="goToRegister()" variant="text" rounded>
                สมัครสมาชิก
              </v-btn>
            </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container> -->
<!-- </template> -->

<template>
  <v-container fluid class="d-flex justify-center align-center" style="height: 100vh;background-color: #23486A;">
    <v-row dense class="login-card">
      <v-col cols="12" md="6" class="form-section">
        <div class="d-flex flex-column justify-center align-center" style="height: 100%;">
          <div class="d-flex justify-center align-center">
            <v-img src="/public/login1.png" height="150" width="150" contain class="animated-image"></v-img>
          </div>
            <v-text-field style="width: 80%" label="Email" required variant="outlined" rounded
              prepend-icon="mdi-account" v-model="email"></v-text-field>
            <v-text-field style="width: 80%" label="Password" variant="outlined" required rounded
              prepend-icon="mdi-lock" v-model="password" :type="showPassword ? 'text' : 'password'">
              <template #append-inner>
                <v-icon @click="togglePasswordVisibility" class="cursor-pointer">
                  {{ showPassword ? "mdi-eye" : "mdi-eye-off" }}
                </v-icon>
              </template>
            </v-text-field>
          <div style="width: 60%;">
            <v-btn @click="summit()" size="large" rounded color="#23486A" style="width: 100%;" class="hover-zoom">เข้าสู่ระบบ</v-btn>
          </div>
          <p style="text-align: center;padding: 10px;">
            <span>ยังไม่มีบัญชีผู้ใช้? </span>
            <v-btn style="color: cornflowerblue; margin-left: -15px" @click="goToRegister()" variant="text" rounded class="hover-zoom">
              สมัครสมาชิก
            </v-btn>
          </p>
        </div>
      </v-col>
      <v-col cols="12" md="6" >
        <v-img src="/public/city.jpg" cover  class="login-image" />
      </v-col>
    </v-row>
  </v-container>
</template>


<style>
.login-page .v-text-field .v-input__append {
  position: absolute;
  left: 75%;
  transform: translateY(70%);
}

.animated-image {
  animation: bounce 2s infinite;
}

@keyframes bounce {

  0%,
  100% {
    transform: translateY(-10px);
  }

  50% {
    transform: translateY(-30px);
  }
}

.center-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  max-width: 80vw;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.form-section {
  padding: 40px;
}
.welcome-text {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 8px;
}

.sub-text {
  font-size: 1rem;
  color: #6c757d;
  margin-bottom: 24px;
}

.or-divider {
  text-align: center;
  margin: 16px 0;
  color: #6c757d;
}

.forgot-password {
  font-size: 0.9rem;
}

.signup-text {
  text-align: center;
  margin-top: 16px;
  color: #6c757d;
}

.login-image {
  width: 100%;
  height: 100%;
  border-radius: 20px;
}

.hover-zoom {
  transition: transform 0.3s ease; /* เพิ่มความนุ่มนวลในการเปลี่ยนแปลง */
}

.hover-zoom:hover {
  transform: scale(1.1); /* ขยายขนาดปุ่มเมื่อเมาส์ชี้ */
}
</style>
