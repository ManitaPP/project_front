<script setup lang="ts">
import HeaderView from "../components/header/headerView.vue";
import SubHeaderView from "../components/header/subHeaderView.vue";
import router from "../router";
import { useAuthStore } from "../stores/auth.store";

const authStore = useAuthStore();
const goToMainPage = () => {
  if (authStore.currentUser?.role === "admin") {
    router.push("/userManagement");
  } else {
    router.push("/profile");
  }
};
</script>
<template>
  <HeaderView />
  <v-container>
    <SubHeaderView style="position: absolute; top: 0; left: 0; z-index: 1" />
    <v-row style="margin-top: 10%">
      <v-col cols="12" class="text-center">
        <v-img src="/public/restriction.png" :width="200" class="mx-auto"></v-img>
        <p style="font-size: xx-large; margin-bottom: 1%">
          คุณไม่ได้รับอนุญาตให้เข้าสู่หน้าจอนี้ได้
        </p>
        <v-btn @click="goToMainPage()">กลับไปหน้าหลัก</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
