<script setup lang="ts">
import { computed } from "vue";
import { useTheme } from "vuetify";

const theme = useTheme();

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
}
const themeIcon = computed(() =>
  theme.global.current.value.dark ? "mdi-weather-night" : "mdi-weather-sunny"
);
</script>
<template>
  <v-app-bar :elevation="2" style="background-image: url(/public/city.jpg)">
    <!-- <template v-slot:prepend> </template> -->
    <!-- <v-img src="/public//application.png" style="height: 70%" class="align-left"></v-img> -->
    <v-app-bar-title style="font-weight: bold">CDG </v-app-bar-title>
    <v-switch
      style="margin-right: 3%; margin-top: 1px"
      @click="toggleTheme"
      class="d-flex align-center"
    >
      <template #prepend>
        <v-icon>{{ themeIcon }}</v-icon>
      </template>
    </v-switch>
  </v-app-bar>
</template>

<style scoped>
.align-left {
  margin-left: -48%;
  padding-left: 0;
  float: left;
}
</style>
