<script lang="ts" setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth.store";
import router from "../router";

const password = ref("");
const email = ref("");
const authStore = useAuthStore();

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
    <v-row align="center" justify="center" style="height: 100vh">
      <v-col cols="12" sm="6" md="4">
        <v-card>
          <v-card-title class="text-center">เข้าสู่ระบบ</v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field
                label="Email"
                required
                variant="solo"
                prepend-icon="mdi-account"
                v-model="email"
              ></v-text-field>
              <v-text-field
                label="Password"
                type="password"
                variant="solo"
                prepend-icon="mdi-lock"
                required
                v-model="password"
              ></v-text-field>
            </v-form>
            <v-card-actions>
              <v-btn @click="summit()" color="success">ยืนยัน</v-btn>
              <v-spacer></v-spacer>
              <v-btn @click="goToRegister()" color="primary">สมัครสมาชิก</v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style></style>
