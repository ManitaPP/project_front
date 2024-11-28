<script lang="ts" setup>
import { onMounted } from "vue";
import { useUserStore } from "../../stores/user.store";

const userStore = useUserStore();

onMounted(async () => {
  await userStore.getOneByName(userStore.name);
});
</script>
<template>
  <v-container align="center">
    <v-card style="width: 70%" variant="elevated">
      <v-card-title
        style="text-align: center; font-weight: bold; background-color: #6a669d"
        >ข้อมูลผู้ใช้
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row align="center">
          <v-col
            ><v-img src="/public/profile.png" width="100" height="100"></v-img
          ></v-col>
        </v-row>
        <v-row style="text-align: left">
          <v-col>รหัสบัตรประชาชน: {{ userStore.currentUser?.thaiId }} </v-col>
        </v-row>
        <v-row style="text-align: left">
          <v-col>ชื่อ: {{ userStore.currentUser?.name }} </v-col>
        </v-row>
        <v-row style="text-align: left">
          <v-col>เบอร์: {{ userStore.currentUser?.tel }} </v-col>
        </v-row>
        <v-row style="text-align: left">
          <v-col>ตำแหน่ง: {{ userStore.currentUser?.position?.name }} </v-col>
        </v-row>
        <v-row
          style="text-align: left"
          v-if="userStore.currentUser?.position?.name !== 'CEO'"
        >
          <v-col>แผนก: {{ userStore.currentUser?.department?.name }} </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="justify-center" style="background-color: #6a669d">
        <v-btn color="error" @click="userStore.showDialog = false">ปิด</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
