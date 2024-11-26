<script setup lang="ts">
import Swal from "sweetalert2";
import HeaderView from "../components/header/headerView.vue";
import SubHeaderView from "../components/header/subHeaderView.vue";
import { useDepartmentStore } from "../stores/department.store";
import { usePositionStore } from "../stores/position.store";
import router from "../router";

const positionStore = usePositionStore();
const departmentStore = useDepartmentStore();

const clear = () => {
  positionStore.namePosition = "";
  positionStore.description = "";
  departmentStore.nameDepartment = "";
  router.push("/userManagement");
};

const savePosition = () => {
  if (
    positionStore.namePosition === "" &&
    departmentStore.nameDepartment === "" &&
    positionStore.description === ""
  ) {
    Swal.fire({
      icon: "error",
      title: "กรุณากรอกข้อมูลให้ครบถ้วน",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }
  const position = {
    name: positionStore.namePosition,
    description: positionStore.description,
  };
  const department = {
    name: departmentStore.nameDepartment,
  };
  positionStore.createPosition(position);
  departmentStore.createDepartment(department);
  Swal.fire({
    icon: "success",
    title: "บันทึกข้อมูลสำเร็จ",
    showConfirmButton: false,
    timer: 1500,
  });
  clear();
};
</script>
<template>
  <HeaderView />
  <v-container>
    <SubHeaderView style="position: absolute; top: 0; left: 0; z-index: 1" />
    <v-card class="glass-card" align="center" justify="center" style="overflow-y: auto">
      <v-card-text>
        <v-row>
          <v-col>
            <v-row align="center" justify="center">
              <v-col col="6" sm="6">
                <v-card-title>ตำแหน่ง</v-card-title
                ><v-text-field
                  label="ตำแหน่ง"
                  variant="solo"
                  rounded
                  prepend-icon="mdi-card-account-details"
                  v-model="positionStore.namePosition"
                ></v-text-field
              ></v-col>
            </v-row>
            <v-row align="center" justify="center">
              <v-col col="6" sm="6"
                ><v-text-field
                  label="คำอธิบาย"
                  rounded
                  variant="solo"
                  v-model="positionStore.description"
                  prepend-icon="mdi-card-account-details"
                ></v-text-field
              ></v-col>
            </v-row>
            <v-row align="center" justify="center">
              <v-col col="6" sm="6"
                ><v-text-field
                  label="แผนก"
                  rounded
                  variant="solo"
                  v-model="departmentStore.nameDepartment"
                  prepend-icon="mdi-card-account-details"
                ></v-text-field
              ></v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-card-actions>
                  <v-btn
                    variant="flat"
                    size="large"
                    rounded
                    color="error"
                    @click="clear()"
                    >กลับ</v-btn
                  >
                  <v-spacer></v-spacer>
                  <v-btn
                    variant="flat"
                    size="large"
                    rounded
                    color="primary"
                    @click="savePosition()"
                    >ยืนยัน</v-btn
                  >
                </v-card-actions>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.2); /* ตั้งค่าความโปร่งแสงของพื้นหลัง */
  backdrop-filter: blur(10px); /* ใช้ฟิลเตอร์ทำให้พื้นหลังมัว */
  border-radius: 15px; /* กำหนดขอบเรียบร้อย */
  border: 1px solid rgba(255, 255, 255, 0.3); /* ขอบโปร่งแสง */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* เงาสำหรับเพิ่มมิติ */
  padding: 20px; /* ระยะห่างภายใน */
  color: #fff; /* สีตัวอักษร */
}
</style>
