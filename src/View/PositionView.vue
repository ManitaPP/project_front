<script setup lang="ts">
import Swal from "sweetalert2";
import HeaderView from "../components/header/headerView.vue";
import SubHeaderView from "../components/header/subHeaderView.vue";
import { useDepartmentStore } from "../stores/department.store";
import { usePositionStore } from "../stores/position.store";
import router from "../router";
import { ref } from "vue";

const positionStore = usePositionStore();
const departmentStore = useDepartmentStore();
const showP = ref(false);
const showD = ref(false);

const clear = () => {
  positionStore.namePosition = "";
  positionStore.description = "";
  departmentStore.nameDepartment = "";
  positionStore.priority = 1;
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
    priority: positionStore.priority,
  };
  const department = {
    name: departmentStore.nameDepartment,
  };
  if (showP.value === true) {
    positionStore.createPosition(position);
  }
  if (showD.value === true) {
    departmentStore.createDepartment(department);
  }
  Swal.fire({
    icon: "success",
    title: "บันทึกข้อมูลสำเร็จ",
    showConfirmButton: false,
    timer: 1500,
  });
  clear();
};

const showPosition = () => {
  showP.value = !showP.value;
  if (showP.value) showD.value = false;
};

const showDepartment = () => {
  showD.value = !showD.value;
  if (showD.value) showP.value = false;
};
</script>
<template>
  <HeaderView />
  <v-container>
    <SubHeaderView style="position: absolute; top: 0; left: 0; z-index: 1" />
    <v-card
      align="center"
      justify="center"
      class="glass-card styled-scrollbar"
      style="overflow-y: auto; max-height: 80vh"
    >
      <v-row>
        <v-col>
          <v-card-title>เพิ่มตำแหน่ง</v-card-title>
          <v-btn @click="showPosition">ตำแหน่ง</v-btn>
        </v-col>
        <v-col>
          <v-card-title>เพิ่มแผนก</v-card-title>
          <v-btn @click="showDepartment">แผนก</v-btn>
        </v-col>
      </v-row>
      <v-card-text>
        <v-row v-if="showP">
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
                ><v-combobox
                  label="ลำดับความสำคัญ"
                  rounded
                  prepend-icon="mdi-order-bool-ascending"
                  variant="solo"
                  v-model="positionStore.priority"
                  :items="[1, 2, 3, 4, 5, 7, 8, 9, 10]"
                ></v-combobox
              ></v-col>
            </v-row>
            <v-row align="center" justify="center">
              <v-col col="6" sm="6"
                ><v-text-field
                  label="คำอธิบาย"
                  rounded
                  variant="solo"
                  v-model="positionStore.description"
                  prepend-icon="mdi-text-box-outline"
                ></v-text-field
              ></v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row align="center" justify="center" v-if="showD">
          <v-col col="6" sm="6">
            <v-card-title>แผนก</v-card-title
            ><v-text-field
              label="แผนก"
              rounded
              variant="solo"
              v-model="departmentStore.nameDepartment"
              prepend-icon="mdi-card-account-details"
            ></v-text-field
          ></v-col>
        </v-row>
      </v-card-text>
      <v-row>
        <v-col>
          <v-card-actions>
            <v-btn variant="flat" size="large" rounded color="error" @click="clear()"
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
    </v-card>
  </v-container>
</template>

<style scoped></style>
