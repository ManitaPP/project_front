<script setup lang="ts">
import Swal from "sweetalert2";
import { useUserStore } from "../../stores/user.store";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useDepartmentStore } from "../../stores/department.store";
import { usePositionStore } from "../../stores/position.store";

const userStore = useUserStore();
const departmentStore = useDepartmentStore();
const positionStore = usePositionStore();
const nameDepartment = ref("");
const namePosition = ref("");
let selectedLeader = ref("");

const showLeaderSelect = computed(() => {
  if (userStore.currentUser!.positionId === null) {
    return namePosition.value !== "CEO" && namePosition.value !== "";
  } else {
    selectedLeader.value = userStore.currentUser!.leaderId
      ? userStore.users.find((u) => u.userId === userStore.currentUser!.leaderId)?.name ??
        ""
      : "";
    return userStore.currentUser?.position?.name !== "CEO";
  }
});
const showDepartmentSelect = computed(() => {
  if (userStore.currentUser!.positionId === null) {
    return namePosition.value !== "CEO";
  } else {
    return userStore.currentUser?.position?.name !== "CEO";
  }
});

const departmentLeaders = computed(() => {
  const currentUserDepartmentId = userStore.currentUser?.departmentId;
  const currentUserId = userStore.currentUser?.userId;
  const currentUserPositionId = userStore.currentUser?.positionId;

  const filteredUsers = userStore.users.filter((user) => {
    const isCurrentUsersSubordinate = user.leaderId === currentUserId; // Check if the current user is the leader
    return (
      user.role === "user" &&
      user.userId !== currentUserId &&
      user.positionId !== currentUserPositionId &&
      user.departmentId === currentUserDepartmentId &&
      user.departmentId != null &&
      !isCurrentUsersSubordinate // Exclude if current user is their leader
    );
  });

  const leader = filteredUsers.map((user) => ({
    name: user.name,
    id: user.userId,
  }));

  return leader.map((leader) => leader.name);
});

const cancel = async () => {
  userStore.showDialog = false;
  await userStore.getUsers();
  clearMessage();
};
const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

watch(
  () => userStore.currentUser?.position?.name,
  (newVal) => {
    if (newVal) {
      userStore.currentUser!.position!.name = newVal;
      const newPosition = positionStore.positions.find((p) => p.name === newVal);
      if (newPosition) {
        userStore.currentUser!.positionId = newPosition.id;
      } else {
        console.error("Position not found:", newVal);
        userStore.currentUser!.positionId = undefined;
      }
      showLeaderSelect.value;
    }
  }
);

watch(
  () => userStore.currentUser?.department?.name,
  (newVal) => {
    if (newVal) {
      userStore.currentUser!.department!.name = newVal;
      const newDepartment = departmentStore.departments.find((d) => d.name === newVal);
      if (newDepartment) {
        userStore.currentUser!.departmentId = newDepartment.id;
      } else {
        userStore.currentUser!.departmentId = null;
      }
    }
  }
);

watch(
  () => userStore.currentUser?.thaiId,
  (newVal) => {
    if (newVal && newVal.length !== 13) {
      userStore.thaiIdError = "รหัสบัตรประชาชนต้องมี 13 หลัก";
    }
    if (newVal && newVal.length === 13) {
      userStore.thaiIdError = "";
    }
  }
);
watch(
  () => userStore.currentUser?.name,
  (newVal) => {
    if (newVal && newVal.length <= 3) {
      userStore.nameError = "ชื่อ-นามสกุลต้องมีความยาวมากกว่า 3 ตัวอักษร";
    }
    if (newVal && newVal.length > 3) {
      userStore.nameError = "";
    }
  }
);
watch(
  () => userStore.currentUser?.tel,
  (newVal) => {
    if (newVal && !/^0\d{9}$/.test(newVal)) {
      userStore.telError = "เบอร์โทรศัพท์ต้องมี 10 หลัก";
    }
    if (newVal && newVal.length === 10) {
      userStore.telError = "";
    }
  }
);
watch(
  () => userStore.currentUser?.email,
  (newVal) => {
    if (newVal && validateEmail(newVal)) {
      userStore.emailError = "";
    }
    if (newVal && !validateEmail(newVal)) {
      userStore.emailError = "กรุณากรอกอีเมลให้ถูกต้อง";
    }
  }
);

const clearMessage = () => {
  userStore.nameError = "";
  userStore.emailError = "";
  userStore.thaiIdError = "";
  userStore.telError = "";
};
const editUser = async () => {
  if (userStore.currentUser) {
    if (userStore.currentUser.positionId === null) {
      const position = positionStore.positions.find((p) => p.name === namePosition.value);
      userStore.currentUser.positionId = position?.id;
    }
    if (userStore.currentUser.departmentId === null) {
      const department = departmentStore.departments.find(
        (d) => d.name === nameDepartment.value
      );
      userStore.currentUser.departmentId = department?.id;
    }
    if (userStore.currentUser.position?.name === "CEO") {
      userStore.currentUser.departmentId = null;
    }
    userStore.currentUser.leaderId = userStore.users.find(
      (u) => u.name === selectedLeader.value
    )?.userId;
    userStore.updateUser(userStore.currentUser?.userId!, userStore.currentUser);
    userStore.showDialog = false;
    Swal.fire({
      icon: "success",
      title: "แก้ไขข้อมูลสำเร็จ",
      showConfirmButton: false,
      timer: 1500,
    });
  }
};

onMounted(() => {
  departmentStore.getDepartments();
  positionStore.getPositions();
  userStore.getUsers();
});
</script>
<template>
  <v-container align="center" justify="center">
    <v-card style="width: 70%">
      <v-card-title style="text-align: center">แก้ไขข้อมูลผู้ใช้</v-card-title>
      <v-card-text>
        <v-row>
          <v-col col="6"
            ><v-text-field
              label="รหัสบัตรประชาชน"
              variant="solo"
              prepend-icon="mdi-card-account-details"
              :error-messages="userStore.thaiIdError"
              v-model="userStore.currentUser!.thaiId"
            ></v-text-field
          ></v-col>
          <v-col col="6"
            ><v-text-field
              label="ชื่อ-นามสกุล"
              variant="solo"
              prepend-icon="mdi-account-circle"
              :error-messages="userStore.nameError"
              v-model="userStore.currentUser!.name"
            ></v-text-field
          ></v-col>
        </v-row>
        <v-row>
          <v-col col="6"
            ><v-text-field
              label="เบอร์โรศัพท์"
              variant="solo"
              prepend-icon="mdi-phone"
              :error-messages="userStore.telError"
              v-model="userStore.currentUser!.tel"
            ></v-text-field
          ></v-col>
          <v-col col="6"
            ><v-text-field
              label="อีเมล"
              variant="solo"
              prepend-icon="mdi-email"
              :error-messages="userStore.emailError"
              v-model="userStore.currentUser!.email"
            ></v-text-field
          ></v-col>
        </v-row>
        <v-row>
          <v-col col="6">
            <v-select
              label="ตำแหน่ง"
              prepend-icon="mdi-email"
              :items="positionStore.positions.map((p) => p.name)"
              variant="solo"
              v-if="userStore.currentUser!.positionId === null"
              v-model="namePosition"
              @change="() => (selectedLeader = '')"
            ></v-select>
            <v-select
              label="ตำแหน่ง"
              prepend-icon="mdi-email"
              :items="positionStore.positions.map((p) => p.name)"
              variant="solo"
              v-model="userStore.currentUser!.position!.name"
              v-if="userStore.currentUser && userStore.currentUser.position"
              @change="() => (selectedLeader = '')"
            ></v-select>
          </v-col>
          <v-col col="6">
            <v-select
              label="แผนก"
              prepend-icon="mdi-email"
              :items="departmentStore.departments.map((d) => d.name)"
              variant="solo"
              v-if="userStore.currentUser!.positionId === null"
              v-model="nameDepartment"
            ></v-select>
            <v-select
              label="แผนก"
              prepend-icon="mdi-email"
              :items="departmentStore.departments.map((d) => d.name)"
              variant="solo"
              v-model="userStore.currentUser!.department!.name"
              v-if="userStore.currentUser && userStore.currentUser.department"
              @change="() => (selectedLeader = '')"
            ></v-select>
          </v-col>
        </v-row>
        <v-row v-if="showLeaderSelect">
          <v-col col="12">
            <v-select
              label="เลือกหัวหน้า"
              prepend-icon="mdi-account-tie"
              :items="departmentLeaders"
              v-model="selectedLeader"
              :no-data-text="'ไม่เจอผู้ใช้ในแผนกนี้'"
              variant="solo"
            ></v-select>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-btn color="error" @click="cancel()">ยกเลิก</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="editUser()">บันทึก</v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-container>
</template>
