<script lang="ts" setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth.store";
import router from "../router";

const password = ref("");
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
}
</script>

<template>
  <v-container class="login-page">
    <v-card style="height: 90vh">
      <v-row>
        <v-col style="margin-top: 7%">
          <!-- <v-card> -->
          <v-card-text align="center" justify="center">
            <v-img
              src="/public/login.png"
              height="150"
              width="200"
              class="animated-image"
            ></v-img>
          </v-card-text>
          <v-card-text>
            <v-form>
              <v-text-field
                label="Email"
                required
                variant="solo"
                rounded
                prepend-icon="mdi-account"
                v-model="email"
              ></v-text-field>
              <!-- <v-text-field
                label="Password"
                type="password"
                variant="solo"
                prepend-icon="mdi-lock"
                required
                v-model="password"
              ></v-text-field> -->
              <v-text-field
                label="รหัสผ่าน"
                variant="solo"
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
            </v-form>
            <v-row style="justify-content: center">
              <v-col cols="10">
                <v-btn
                  @click="summit()"
                  size="large"
                  color="success"
                  variant="tonal"
                  block
                  rounded
                  >เข้าสู่ระบบ</v-btn
                >
              </v-col>
            </v-row>
            <v-row style="justify-content: center">
              <v-col cols="10">
                <!-- <v-btn
                  @click="goToRegister()"
                  size="large"
                  color="primary"
                  variant="tonal"
                  rounded
                  block
                  >สมัครสมาชิก</v-btn
                > -->
                <p
                  style="text-align: center; color: cornflowerblue"
                  @click="goToRegister()"
                >
                  สมัครสมาชิก
                </p>
              </v-col>
            </v-row>
          </v-card-text>
          <!-- </v-card> -->
        </v-col>
        <v-col class="fullscreen"> </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<style>
.login-page .v-text-field .v-input__append {
  position: absolute;
  left: 42%;
  transform: translateY(70%);
  margin-right: 10px;
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
.fullscreen {
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
  background-color: #ede8dc;
  width: 100vw;
  height: 100vh;
  display: flex;
}
</style>
