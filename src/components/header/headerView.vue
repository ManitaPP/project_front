<script setup lang="ts">
import { computed, ref } from "vue";
import { useTheme } from "vuetify";
import { useAuthStore } from "../../stores/auth.store";

const theme = useTheme();
const authStore = useAuthStore();
const isDarkTheme = ref(theme.global.current.value.dark);

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
}

const themeLabel = computed(() => (isDarkTheme.value ? "Dark Mode" : "Light Mode"));

</script>
<template>
  <v-app-bar :elevation="2" style="background: #23486A">
    <v-app-bar-title style="font-weight: bold;color: aliceblue;">CDG</v-app-bar-title>
    <v-row align="end" justify="end" style="margin-right: 10px;">
      <v-col cols="auto">
        <v-list dense nav style="background: #23486A;color: aliceblue;">
          <v-list-item title="แผนผังองค์กร" value="แผนผังองค์กร" to="/diagram"></v-list-item>
        </v-list>
      </v-col>
      <v-col cols="auto">
        <v-list dense nav style="background: #23486A;color: aliceblue;">
          <v-list-item title="อัปโหลดรูปภาพ" value="อัปโหลดรูปภาพ" link
            to="/capImage"></v-list-item>
        </v-list>
      </v-col>
      <v-col cols="auto">
        <v-list dense nav style="background: #23486A;color: aliceblue;">
          <v-list-item v-if="authStore.currentUser?.role === 'admin'" title="จัดการข้อมูลผู้ใช้งาน"
            value="จัดการข้อมูลผู้ใช้งาน" link to="/userManagement"></v-list-item>
        </v-list>
      </v-col>
    </v-row>
    <v-menu transition="slide-y-transition">
      <template v-slot:activator="{ props }">
        <div style="margin-right: 15px;">
          <v-img v-bind="props" src="/public/profile.png" width="50" height="50" style="cursor: pointer;"></v-img>
        </div>
      </template>

      <v-list>
        <v-list-item prepend-icon="mdi-account-tie" title="แก้ไขข้อมูลผู้ใช้งาน" value="โปรไฟล์" link to="/profile">
        </v-list-item>
        <v-list-item>
          <v-switch v-model="isDarkTheme" :label="themeLabel" inset @change="toggleTheme" @click.stop></v-switch>
        </v-list-item>
        <v-list-item prepend-icon="mdi-exit-to-app" title="ออกจากระบบ" value="ออกจากระบบ" link class="mt-auto"
          @click="authStore.logout()">
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<style scoped>
.align-left {
  margin-left: -48%;
  padding-left: 0;
  float: left;
}
</style>
