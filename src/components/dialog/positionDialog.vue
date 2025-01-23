<script lang="ts" setup>
import Swal from 'sweetalert2';
import { usePositionStore } from '../../stores/position.store';
import { useUserStore } from '../../stores/user.store';
import { watch } from 'vue';

const positionStore = usePositionStore();
const userStore = useUserStore();

const clear = () => {
  positionStore.namePosition = "";
  positionStore.description = "";
  positionStore.priority = 1;
  positionStore.namePositionError = "";
  userStore.showDialog3 = false;
  userStore.showPositionDialog = false;

};

watch(
  () => positionStore.namePosition,
  (newVal) => {

    if (newVal.length <= 2) {
      positionStore.namePositionError = "ชื่อตำแหน่งต้องมีความยาวมากกว่า 2 ตัวอักษร";
    } else {
      positionStore.namePositionError = "";
    }
  }
);


const savePosition = () => {
  if (
    positionStore.namePosition.length <= 2
  ) {
    positionStore.namePositionError = "ชื่อตำแหน่งต้องมีความยาวมากกว่า 2 ตัวอักษร";
    return;
  } else {
    const position = {
      name: positionStore.namePosition,
      description: positionStore.description,
      priority: positionStore.priority,
    };
    positionStore.createPosition(position);
    Swal.fire({
      icon: "success",
      title: "บันทึกข้อมูลสำเร็จ",
      showConfirmButton: false,
      timer: 1500,
    });
    clear();
    window.location.reload();
    userStore.showDialog3 = false;
    userStore.showPositionDialog = false;
  }
};
</script>
<template>
  <v-container align="center" justify="center">
    <v-card width="50vw">
      <v-card-title>เพิ่มตำแหน่ง</v-card-title>
      <v-card-text>
        <v-row align="center" justify="center">
          <v-col col="6" sm="6">
            <v-text-field label="ตำแหน่ง" variant="solo" rounded prepend-icon="mdi-card-account-details"
              v-model="positionStore.namePosition"
              :error-messages="positionStore.namePositionError"></v-text-field></v-col>
        </v-row>
        <v-row align="center" justify="center">
          <v-col col="6" sm="6"><v-combobox label="ลำดับความสำคัญ" rounded prepend-icon="mdi-order-bool-ascending"
              variant="solo" v-model="positionStore.priority" :items="[
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20,
              ]"></v-combobox></v-col>
        </v-row>
        <v-row align="center" justify="center">
          <v-col col="6" sm="6"><v-text-field label="คำอธิบาย" rounded variant="solo"
              v-model="positionStore.description" prepend-icon="mdi-text-box-outline"></v-text-field></v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn variant="flat" size="large" rounded color="error" @click="clear()">กลับ</v-btn>
        <v-spacer></v-spacer>
        <v-btn variant="flat" size="large" rounded color="primary" @click="savePosition()">ยืนยัน</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>