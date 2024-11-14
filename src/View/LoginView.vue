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
  <v-container fluid fill-height>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6" md="4">
        <v-card style="margin-top: 30%">
          <v-card-text align="center" justify="center">
            <v-img src="/public/login.png" height="150" width="200"></v-img>
          </v-card-text>
          <v-card-text>
            <v-form>
              <v-text-field
                label="Email"
                required
                variant="solo"
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
            <v-card-actions>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-btn @click="summit()" color="success" variant="tonal" block
                    >ยืนยัน</v-btn
                  >
                </v-col>
                <v-col cols="12" sm="6">
                  <v-btn @click="goToRegister()" color="primary" variant="tonal" block
                    >สมัครสมาชิก</v-btn
                  >
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
.v-text-field .v-input__append {
  position: absolute;
  right: 5%;
  transform: translateY(70%);
  margin-right: 10px;
}
</style>
