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
  console.log("login", email.value, password.value);
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

<template>
  <v-container class="login-page" align="center" justify="center">
    <v-card style="height: auto; width: 40vw; margin-top: 20px" class="glass-card">
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
                <v-btn @click="summit()" size="large" block rounded color="#CDC1FF"
                  >เข้าสู่ระบบ</v-btn
                >
              </v-col>
            </v-row>
            <v-row justify="center" align="center" class="d-flex">
              <span>ยังไม่มีบัญชีผู้ใช้?</span>
              <v-btn
                style="color: cornflowerblue; margin-left: -15px"
                @click="goToRegister()"
                variant="text"
                rounded
              >
                สมัครสมาชิก
              </v-btn>
            </v-row>
          </v-card-text>
          <!-- </v-card> -->
        </v-col>
        <!-- <v-col class="fullscreen">
          <v-img
            src="/public/มิ้นมงคล.jpg"
            height="400"
            width="400"
            class="animated-image"
          ></v-img>
        </v-col> -->
      </v-row>
    </v-card>
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
</style>
