<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
let isLoginPage = route.path === "/login";
</script>

<template>
  <!-- <v-app style="background-image: url(/public/city.jpg)"> -->
    <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
