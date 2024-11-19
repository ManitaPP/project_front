<script setup lang="ts">
import { onMounted } from "vue";
import HeaderView from "../components/header/headerView.vue";
import SubHeaderView from "../components/header/subHeaderView.vue";
import { useAuthStore } from "../stores/auth.store";
const authStore = useAuthStore();
onMounted(() => {
  if (!authStore.currentUser && localStorage.getItem("user")) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    authStore.currentUser = user;
  }
});
</script>

<template>
  <HeaderView />
  <v-container>
    <SubHeaderView style="position: absolute; top: 0; left: 0; z-index: 1" />
    <v-row>
      <v-col col="12">
        <v-card>
          <v-card-title style="text-align: center">ข้อมูลผู้ใช้</v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <p>รหัสบัตรประชาชน: {{ authStore.currentUser?.thaiId }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col col="2">
                <p>ชื่อ-นามสกุล: {{ authStore.currentUser?.name }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <p>อีเมล: {{ authStore.currentUser?.email }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <p>เบอร์: {{ authStore.currentUser?.tel }}</p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
