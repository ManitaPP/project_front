<script lang="ts" setup>
import router from "../../router";
import HeaderView from "../../components/header/headerView.vue";
import { onMounted, ref } from "vue";
import { useReqRecvStore } from "../../stores/reqRecv.store";
import { useAuthStore } from "../../stores/auth.store";
import EditRequestDialog from "../../components/dialog/editRequestDialog.vue";
import Swal from "sweetalert2";
import { ReqRecv } from "../../stores/types/ReqRecv";

const reqRecvStore = useReqRecvStore();
const authStore = useAuthStore();

const goToRequest = () => {
  router.push("/request");
};

const goToDialogEdit = async (id: number, req: ReqRecv) => {
  if (
    req.status !== "กำลังดำเนินการ" &&
    req.status !== "อนุมัติ" &&
    req.status !== "ไม่อนุมัติ"
  ) {
    await reqRecvStore.updateReceived(id, "กำลังดำเนินการ");
  }
  reqRecvStore.reqId = id;
  reqRecvStore.showDialog = true;
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("th-TH", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

onMounted(async () => {
  await reqRecvStore.getReceiverByUser(authStore.currentUser?.userId!);
});

const Approve = async (id: number) => {
  Swal.fire({
    title: "ต้องการอนุมัติคำร้องนี้หรือไม่?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "อนุมัติคำร้อง",
    cancelButtonText: "ยกเลิก",
  }).then(async (result) => {
    if (result.isConfirmed) {
      await reqRecvStore.updateReceived(id, "อนุมัติ");
      const request = reqRecvStore.ReqRecvs.find((item) => item.id === id);
      if (request) {
        request.status = "อนุมัติ";
      }
      await reqRecvStore.updateRespondedRequest(id, request?.updatedAt!);

      Swal.fire({
        title: "อนุมัติคำร้องสำเร็จ",
        text: "คำร้องได้รับการอนุมัติแล้ว",
        icon: "success",
      });
    }
  });
};

const NotApproved = async (id: number) => {
  Swal.fire({
    title: "ต้องการไม่อนุมัติคำร้องนี้หรือไม่?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "ไม่อนุมัติคำร้อง",
    cancelButtonText: "ยกเลิก",
  }).then(async (result) => {
    if (result.isConfirmed) {
      await reqRecvStore.updateReceived(id, "ไม่อนุมัติ");
      const request = reqRecvStore.ReqRecvs.find((item) => item.id === id);
      if (request) {
        request.status = "ไม่อนุมัติ";
      }
      Swal.fire({
        title: "ไม่อนุมัติคำร้องสำเร็จ",
        text: "คำร้องนี้ไม่สามารถดำเนินการต่อได้",
        icon: "success",
      });
    }
  });
};

const SumRequest = async () => {};
</script>

<template>
  <HeaderView />
  <v-container align="center" justify="center">
    <v-card>
      <v-card-title style="font-weight: bold">
        <v-btn
          class="position-absolute"
          style="left: 16px"
          variant="text"
          prepend-icon="mdi-arrow-left"
          @click="goToRequest"
          >ย้อนกลับ</v-btn
        >ประวัติคำร้อง</v-card-title
      >
      <div
        v-for="(item, index) in reqRecvStore.ReqRecvs"
        :key="index"
        v-if="reqRecvStore.ReqRecvs.length > 0"
      >
        <v-card
          width="80%"
          class="pa-5 mb-4"
          hover
          @click="goToDialogEdit(item.id!,item)"
          v-if="item.status !== 'อนุมัติ' && item.status !== 'ไม่อนุมัติ'"
        >
          <v-row>
            <v-col cols="8" class="text-left">
              <v-card-title>{{ item.request?.requestType?.name }}</v-card-title>
              <v-card-text>
                <div>ประเภทคำร้อง: {{ item.request?.requestType?.type }}</div>
                <div>
                  ส่งคำร้องเมื่อ: {{ formatDate(item.createdAt?.toString() || "") }}
                </div>
              </v-card-text>
            </v-col>
            <v-col cols="4" class="text-right">
              <div>ผู้ส่งคำร้อง: {{ item.request?.user?.name }}</div>
            </v-col>
          </v-row>
          <div class="action-buttons">
            <v-btn
              class="hover-zoom"
              variant="tonal"
              color="error"
              @click.stop="NotApproved(item.id!)"
              >ไม่อนุมัติ</v-btn
            >
            <v-btn
              class="hover-zoom"
              variant="tonal"
              color="success"
              @click.stop="Approve(item.id!)"
              >อนุมัติ</v-btn
            >
            <v-btn
              class="hover-zoom"
              variant="tonal"
              color="primary"
              @click.stop="SumRequest()"
              >ส่งคำร้อง</v-btn
            >
          </div>
        </v-card>
      </div>
      <div v-if="reqRecvStore.ReqRecvs.length === 0">
        <v-card-title style="color: red">ไม่มีคำร้องที่ส่งเข้ามา</v-card-title>
      </div>
    </v-card>
    <v-dialog v-model="reqRecvStore.showDialog">
      <EditRequestDialog />
    </v-dialog>
  </v-container>
</template>

<style>
.action-buttons {
  position: absolute;
  right: 16px;
  bottom: 16px;
  display: flex;
  gap: 8px;
}

.hover-zoom {
  transition: transform 0.3s ease;
}

.hover-zoom:hover {
  transform: scale(1.1);
}
</style>
