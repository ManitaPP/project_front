<script lang="ts" setup>
import { onMounted } from "vue";
import { useAuthStore } from "../../stores/auth.store";

const authStore = useAuthStore();
onMounted(() => {
  if (!authStore.currentUser && localStorage.getItem("user")) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    authStore.currentUser = user;
  }

  console.log(authStore.currentUser);
});
</script>
<template>
  <v-card class="fill-height">
    <v-container fluid class="fill-height pa-0 ma-0">
      <v-navigation-drawer
        expand-on-hover
        rail
        permanent
        class="fill-height"
        color="#E1D7C6"
      >
        <v-list>
          <v-list-item
            prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
            :subtitle="authStore.currentUser?.email"
            :title="authStore.currentUser?.name"
          ></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list dense nav>
          <v-list-item
            prepend-icon="mdi-home"
            title="หน้าหลัก"
            value="หน้าหลัก"
            link
            v-if="authStore.currentUser?.role === 'user'"
            to="/profile"
          ></v-list-item>
          <v-list-item
            v-if="authStore.currentUser?.role === 'admin'"
            prepend-icon="mdi-home"
            title="หน้าหลัก"
            value="หน้าหลัก"
            link
            to="/userManagement"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-exit-to-app"
            title="ออกจากระบบ"
            value="ออกจากระบบ"
            link
            @click="authStore.logout()"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-container>
  </v-card>
</template>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
}
</style>
