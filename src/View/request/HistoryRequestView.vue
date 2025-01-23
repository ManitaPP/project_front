<script lang="ts" setup>
import { computed, onMounted } from "vue";
import HeaderView from "../../components/header/headerView.vue";
import { useReqRecvStore } from "../../stores/reqRecv.store";
import { useAuthStore } from "../../stores/auth.store";
import router from "../../router";
import { it } from "node:test";

const reqRecvStore = useReqRecvStore();
const authStore = useAuthStore();

onMounted(async () => {
  await reqRecvStore.getReqRecvByUser(authStore.currentUser?.userId!);
});

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("th-TH", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

const goToRequest = () => {
  router.push("/request");
};

function getProgressValue(status: string): number {
  switch (status) {
    case "ไม่อนุมัติ":
      return 0;
    case "รอดำเนินการ":
      return 25;
    case "กำลังดำเนินการ":
      return 50;
    case "กำลังตรวจสอบเพิ่มเติม":
      return 75;
    case "อนุมัติ":
      return 100;
    default:
      return 0;
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case "ไม่อนุมัติ":
      return "red";
    case "รอดำเนินการ":
      return "orange";
    case "กำลังดำเนินการ":
      return "blue";
    case "กำลังตรวจสอบเพิ่มเติม":
      return "purple";
    case "อนุมัติ":
      return "green";
    default:
      return "grey";
  }
}

const filteredRequests = computed(() => {
  const uniqueRequests = new Map();
  reqRecvStore.ReqRecvs.forEach((item) => {
    const existingItem = uniqueRequests.get(item.requestId);
    if (
      !existingItem ||
      (item.status === "กำลังตรวจสอบเพิ่มเติม" &&
        existingItem.status !== "กำลังตรวจสอบเพิ่มเติม")
    ) {
      uniqueRequests.set(item.requestId, item);
    }
  });
  return Array.from(uniqueRequests.values());
});
</script>
<template>
  <HeaderView />
  <v-container align="center" justify="center">
    <v-card>
      <v-card-title style="font-weight: bold">
        <v-btn class="position-absolute" style="left: 16px" variant="text" prepend-icon="mdi-arrow-left"
          @click="goToRequest">ย้อนกลับ</v-btn>ประวัติคำร้อง</v-card-title>
      <div v-for="(item, index) in filteredRequests" :key="index">
        <v-card width="80%" class="pa-5 mb-4" hover>
          <v-row>
            <v-col cols="8" class="text-left">
              <v-card-title>{{ item.request?.requestType?.name }}</v-card-title>
              <v-card-text>
                <div>
                  <v-progress-linear :color="getStatusColor(item.status)" :height="10"
                    :model-value="getProgressValue(item.status)" striped></v-progress-linear>
                </div>
                <div>ประเภทคำร้อง: {{ item.request?.requestType?.type }}</div>
                <div>ผู้รับผิดชอบคำร้อง: {{ item.user?.name }}</div>
                <div>
                  ส่งคำร้องเมื่อ: {{ formatDate(item.createdAt?.toString() || "") }}
                </div>
              </v-card-text>
            </v-col>
            <v-col cols="4" class="text-right">
              <v-btn class="hover-zoom" variant="elevated" :color="getStatusColor(item.status)">สถานะ: {{ item.status
                }}</v-btn>
            </v-col>
          </v-row>
          <v-row v-if="item.status === 'อนุมัติ'">
            <v-col>
              <div class="text-right">
                ได้รับอนุมัติคำร้องเมื่อ:
                {{ formatDate(item.respondedAt?.toString() || "") }}
              </div>
            </v-col>
          </v-row>
          <v-row v-if="item.status === 'ไม่อนุมัติ'">
            <v-col>
              <div class="text-right">
                ไม่รับอนุมัติคำร้องเมื่อ:
                {{ formatDate(item.respondedAt?.toString() || "") }}
              </div>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </v-card>
  </v-container>
</template>

<style>
.hover-zoom {
  transition: transform 0.3s ease;
  /* เพิ่มความนุ่มนวลในการเปลี่ยนแปลง */
}

.hover-zoom:hover {
  transform: scale(1.1);
  /* ขยายขนาดปุ่มเมื่อเมาส์ชี้ */
}
</style>
