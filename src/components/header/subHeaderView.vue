<script lang="ts" setup>
import { onMounted } from "vue";
import { useAuthStore } from "../../stores/auth.store";

const authStore = useAuthStore();
</script>
<template>
  <v-card class="fill-height">
    <v-container fluid class="fill-height pa-0 ma-0">
      <v-navigation-drawer
        expand-on-hover
        rail
        permanent
        class="fill-height d-flex flex-column"
        style="background: linear-gradient(to top, #424769, #6a669d)"
      >
        <v-list>
          <v-list-item
            prepend-icon="mdi-card-account-details"
            :subtitle="authStore.currentUser?.email"
            :title="authStore.currentUser?.name"
          ></v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list dense nav class="flex-grow-1">
          <v-list-item
            prepend-icon="mdi-home"
            title="แผนผังองค์กร"
            value="แผนผังองค์กร"
            link
            to="/diagram"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-account-tie"
            title="โปรไฟล์"
            value="โปรไฟล์"
            link
            to="/profile"
          ></v-list-item>
          <v-list-item
            v-if="authStore.currentUser?.role === 'admin'"
            prepend-icon="mdi-upload"
            title="อัปโหลดรูปภาพ"
            value="อัปโหลดรูปภาพ"
            link
            to="/capImage"
          ></v-list-item>
          <v-list-item
            v-if="authStore.currentUser?.role === 'admin'"
            prepend-icon="mdi-monitor-edit"
            title="จัดการข้อมูลผู้ใช้งาน"
            value="จัดการข้อมูลผู้ใช้งาน"
            link
            to="/userManagement"
          ></v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list dense nav>
          <v-list-item
            prepend-icon="mdi-exit-to-app"
            title="ออกจากระบบ"
            value="ออกจากระบบ"
            link
            class="mt-auto"
            @click="authStore.logout()"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-container>
  </v-card>
</template>
