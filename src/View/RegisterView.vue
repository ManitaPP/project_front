<script setup lang="ts">
import Swal from "sweetalert2";
import router from "../router";
import { useUserStore } from "../stores/user.store";
import { useAuthStore } from "../stores/auth.store";

const userStore = useUserStore();
const authStore = useAuthStore();
const returnToLogin = () => {
  router.push("/login");
};
const saveUser = () => {
  const user = {
    thaiId: userStore.thaiId,
    email: userStore.email,
    password: userStore.password,
    name: userStore.name,
  };
  console.log(user);
  authStore.registerUser(user);
  userStore.thaiId = "";
  userStore.email = "";
  userStore.password = "";
  userStore.name = "";
  router.push("/login");
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
              ></v-text-field>
              <v-text-field
                label="อีเมล"
                required
                variant="solo"
                v-model="userStore.email"
              ></v-text-field>
              <v-text-field
                label="รหัสผ่าน"
                type="password"
                variant="solo"
                required
                v-model="userStore.password"
              ></v-text-field>
              <v-text-field
                label="ชื่อ-นามสกุล"
                variant="solo"
                v-model="userStore.name"
                required
              ></v-text-field>
              <!-- <v-select
                label="เลือกตำแหน่ง"
                variant="solo"
                :items="['person', 'admin']"
                v-model="userStore.role"
              ></v-select> -->
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
