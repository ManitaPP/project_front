<script lang="ts" setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth.store";

const password = ref("");
const email = ref("");
const authStore = useAuthStore();

function summit() {
  console.log("login", email.value, password.value);
  authStore.login(email.value, password.value);
  password.value = "";
  email.value = "";
}
function cancel() {
  password.value = "";
  email.value = "";
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col></v-col>
      <v-col>
        <v-card style="text-align: center">
          <v-card-title>เข้าสู่ระบบ</v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field
                label="Email"
                required
                variant="solo"
                v-model="email"
              ></v-text-field>
              <v-text-field
                label="Password"
                type="password"
                variant="solo"
                required
                v-model="password"
              ></v-text-field>
            </v-form>
            <v-card-actions>
              <v-btn @click="cancel()">ยกเลิก</v-btn>
              <v-spacer></v-spacer>
              <v-btn @click="summit()">ยืนยัน</v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style></style>
