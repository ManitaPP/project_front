<script lang="ts" setup>
import { useUserStore } from "../../stores/user.store";
const userStore = useUserStore();

const cancel = () => {
  userStore.showDialog = false;
};

const saveImage = () => {
  userStore.showDialog = false;
};
</script>
<template>
  <v-container align="center" justify="center">
    <v-card>
      <v-card-title>
        <span class="headline">Upload Image</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6">
            <v-file-input label="อัปโหลดไฟล์" variant="outlined"></v-file-input>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="error" @click="cancel()">ยกเลิก</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveImage()">บันทึก</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
