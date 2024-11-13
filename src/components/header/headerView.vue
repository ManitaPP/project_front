<script setup lang="ts">
import subHeaderView from "./subHeaderView.vue";
</script>
<template>
  <v-app-bar :elevation="2">
    <template v-slot:prepend> </template>
    <v-app-bar-title>Application Bar</v-app-bar-title>
  </v-app-bar>
</template>
