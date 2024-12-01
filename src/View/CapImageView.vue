<script lang="ts" setup>
import UploadImageDialog from "../components/dialog/uploadImageDialog.vue";
import HeaderView from "../components/header/headerView.vue";
import SubHeaderView from "../components/header/subHeaderView.vue";
import { useUserStore } from "../stores/user.store";

const userStore = useUserStore();
const uploadImage = () => {
  userStore.showDialog = true;
};
</script>
<template>
  <HeaderView />
  <v-container>
    <SubHeaderView style="position: absolute; top: 0; left: 0; z-index: 1" />
    <v-row>
      <v-col>
        <v-card class="styled-scrollbar" style="overflow-y: auto; max-height: 80vh">
          <v-card-title style="text-align: center">อัปโหลดรูปภาพ</v-card-title>
          <v-card-actions>
            <v-btn variant="elevated" color="primary" @click="uploadImage">อัปโหลด</v-btn>
          </v-card-actions>
          <v-dialog v-model="userStore.showDialog">
            <UploadImageDialog />
          </v-dialog>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
