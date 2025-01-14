<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import HeaderView from "../../components/header/headerView.vue";
import router from "../../router";
import { useRequestTypeStore } from "../../stores/requestType.store";
import { useAuthStore } from "../../stores/auth.store";
import { useRequestStore } from "../../stores/request.store";
import { useReqRecvStore } from "../../stores/reqRecv.store";
import Swal from "sweetalert2";
import { useUserStore } from "../../stores/user.store";
import { request } from "http";

const requestTypeStore = useRequestTypeStore();
const userStore = useUserStore();
const requestStore = useRequestStore();
const reqRecvStore = useReqRecvStore();
const authStore = useAuthStore();
const selectedType = ref("เลือกประเภทคำร้อง");
const selectUser = ref("เลือกผู้ที่ต้องการยื่นคำร้องให้");
const selectedDepartment = ref("เลือกแผนก");
const selectFile = ref<File | null>(null);
const selectedPosition = ref("เลือกตำแหน่ง");
const detail = ref("");
const goToRequest = () => {
  router.push("/request");
};
onMounted(async () => {
  await userStore.getAllUsers();
  await requestTypeStore.getRequestTypeByName(requestTypeStore.requests);
});

const positionOptions = computed(() => {
  const uniquePositions = new Set(
    userStore.users
      .map((user) => user.position?.name)
      .filter((position) => position !== undefined && position !== null)
  );
  return ["เลือกตำแหน่ง", ...Array.from(uniquePositions)];
});

const departmentOptions = computed(() => {
  const uniqueDepartments = new Set(
    userStore.users
      .map((user) => user.department?.name)
      .filter((department) => department !== undefined && department !== null)
  );
  return ["เลือกแผนก", ...Array.from(uniqueDepartments)];
});

const requestTypeOptions = computed(() => {
  if (!Array.isArray(requestTypeStore.requestTypes)) return [];
  const uniqueRequestTypes = new Set(
    requestTypeStore.requestTypes.map((item) => item.type)
  );
  return ["เลือกประเภทคำร้อง", ...Array.from(uniqueRequestTypes)];
});

const filteredUserOptions = computed(() => {
  if (
    selectedPosition.value === "เลือกตำแหน่ง" &&
    selectedDepartment.value === "เลือกแผนก"
  ) {
    return userStore.users
      .filter((user) => user.userId !== authStore.currentUser?.userId)
      .map((user) => user.name);
  }

  return userStore.users
    .filter(
      (user) =>
        (selectedPosition.value === "เลือกตำแหน่ง" ||
          user.position?.name === selectedPosition.value) &&
        (selectedDepartment.value === "เลือกแผนก" ||
          user.department?.name === selectedDepartment.value)
    )
    .filter((user) => user.userId !== authStore.currentUser?.userId)
    .map((user) => user.name);
});

const createRequest = async () => {
  try {
    if (!userStore.users || userStore.users.length === 0) {
      throw new Error("Users data is not loaded.");
    }

    const newRequest = {
      reason: detail.value,
      file: selectFile.value ? selectFile.value.name : undefined,
      reTypeId:
        requestTypeStore.requestTypes.find((item) => item.type === selectedType.value)
          ?.id ?? 0,
      userId: authStore.currentUser?.userId ?? 0,
    };

    await requestStore.createRequest(newRequest);
    const reqId = requestStore.currentRequest?.id;

    if (reqId) {
      const selectedUser = selectUser.value
        ? userStore.users.find((user) => user.name === selectUser.value)
        : null;
      if (!selectedUser) {
        throw new Error("Selected user not found.");
      }

      const newReqRecv = {
        requestId: reqId,
        userId: selectedUser.userId ?? 0,
        status: "รอดำเนินการ" as "รอดำเนินการ",
        sentAt: requestStore.currentRequest?.createdAt ?? new Date(),
        respondedAt: undefined,
      };

      await reqRecvStore.createReqRecv(newReqRecv);
      Swal.fire({
        title: "ส่งคำขอเรียบร้อยแล้ว",
        icon: "success",
      });
      clear();
      goToRequest();
    } else {
      throw new Error("ไม่สามารถสร้างคำร้องได้");
    }
  } catch (error) {
    console.error(error);
    Swal.fire({
      title: "เกิดข้อผิดพลาดในการสร้างคำร้องหรือส่งต่อ",
      icon: "error",
    });
    goToRequest();
  }
};

const clear = () => {
  selectedType.value = "เลือกประเภทคำร้อง";
  selectUser.value = "เลือกผู้ที่ต้องการยื่นคำร้องให้";
  selectedDepartment.value = "เลือกแผนก";
  selectFile.value = null;
  selectedPosition.value = "เลือกตำแหน่ง";
  detail.value = "";
};
</script>

<template>
  <HeaderView />
  <v-container>
    <v-card>
      <v-row class="align-center">
        <v-col>
          <v-card-title style="text-align: center; font-weight: bold">
            กรอกรายละเอียด {{ requestTypeStore.requests }}
          </v-card-title>
        </v-col>
      </v-row>
      <v-card-text>
        <v-select
          v-if="requestTypeStore.requests !== 'คำร้องขออื่นๆ'"
          label="ประเภทคำร้อง"
          :items="requestTypeOptions"
          v-model="selectedType"
          variant="outlined"
        ></v-select>
        <v-textarea label="รายละเอียด" variant="outlined" v-model="detail"></v-textarea>
        <v-file-input
          label="อัปโหลดไฟล์ (ถ้ามี)"
          prepend-icon=""
          v-model="selectFile"
          variant="outlined"
        ></v-file-input>
        <v-select
          label="ค้นหาตำแหน่งผู้ที่ต้องการยื่นคำร้อง"
          variant="outlined"
          :items="positionOptions"
          v-model="selectedPosition"
        ></v-select>
        <v-select
          label="ค้นหาแผนกผู้ที่ต้องการยื่นคำร้อง"
          variant="outlined"
          :items="departmentOptions"
          v-model="selectedDepartment"
        ></v-select>
        <v-select
          label="ผู้ที่ต้องการยื่นคำร้องให้"
          variant="outlined"
          :items="filteredUserOptions"
          v-model="selectUser"
        ></v-select>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="goToRequest" prepend-icon="mdi-arrow-left">ย้อนกลับ</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="createRequest()"> ยืนยัน </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
