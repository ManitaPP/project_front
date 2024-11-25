<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
let isLoginPage = route.path === "/login";
console.log(isLoginPage);
</script>

<template>
  <v-app style="background-color: #e5e1da">
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
