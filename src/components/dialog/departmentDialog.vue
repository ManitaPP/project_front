<script lang="ts" setup>
import Swal from 'sweetalert2';
import { useDepartmentStore } from '../../stores/department.store';
import { useUserStore } from '../../stores/user.store';
import { watch } from 'vue';


const departmentStore = useDepartmentStore();
const userStore = useUserStore();

const clear = () => {
  departmentStore.nameDepartment = "";
  departmentStore.nameDepartError = "";
  userStore.showDialog2 = false;
  userStore.showPositionDialog = false;

};

watch(
  () => departmentStore.nameDepartment,
  (newVal) => {

    if (newVal.length <= 3) {
      departmentStore.nameDepartError = "ชื่อแผนกต้องมีความยาวมากกว่า 3 ตัวอักษร";
    } else {
      departmentStore.nameDepartError = "";
    }
  }
);

const saveDepartment = () => {
  if (
    departmentStore.nameDepartment.length <= 3
  ) {
    departmentStore.nameDepartError = "ชื่อแผนกต้องมีความยาวมากกว่า 3 ตัวอักษร";
  } else {
    const department = {
      name: departmentStore.nameDepartment,
    };
    departmentStore.createDepartment(department);
    clear();
    Swal.fire({
      icon: "success",
      title: "บันทึกข้อมูลสำเร็จ",
      showConfirmButton: false,
      timer: 1500,
    });
    userStore.showDialog2 = false;
    userStore.showPositionDialog = false;
  }
};

</script>
<template>
  <v-container align="center" justify="center">
    <v-card width="50vw">
      <v-card-title>เพิ่มแผนก</v-card-title>
      <v-card-text>
        <v-col col="6" sm="6">
          <v-text-field label="แผนก" rounded variant="solo" v-model="departmentStore.nameDepartment"
            :error-messages="departmentStore.nameDepartError" prepend-icon="mdi-card-account-details"></v-text-field>
        </v-col>
      </v-card-text>
      <v-card-actions>
        <v-btn variant="flat" size="large" rounded color="error" @click="clear()">กลับ</v-btn>
        <v-spacer></v-spacer>
        <v-btn variant="flat" size="large" rounded color="primary" @click="saveDepartment()">ยืนยัน</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>