<script lang="ts" setup>
import { onMounted } from "vue";
import { useReqRecvStore } from "../../stores/reqRecv.store";

const reqRecvStore = useReqRecvStore();

onMounted(async () => {
  await reqRecvStore.getOneByReqRecv(reqRecvStore.reqId);
});

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("th-TH", {
    dateStyle: "short",
    timeStyle: "short",
  });
}
</script>

<template>
  <v-container>
    <v-card>
      <v-card-title style="text-align: center">{{
        reqRecvStore.currentReqRecv?.request?.requestType?.name
      }}</v-card-title>
      <v-card-text>
        <div>ผู้ส่งคำร้อง: {{ reqRecvStore.currentReqRecv?.request?.user?.name }}</div>
        <div>
          แผนก:
          {{ reqRecvStore.currentReqRecv?.request?.user?.department?.name }} ตำแหน่ง:
          {{ reqRecvStore.currentReqRecv?.request?.user?.position?.name }}
        </div>
        <div>
          ประเภทคำร้อง: {{ reqRecvStore.currentReqRecv?.request?.requestType?.type }}
        </div>
        <div>เหตุผล: {{ reqRecvStore.currentReqRecv?.request?.reason }}</div>
        <div v-if="reqRecvStore.currentReqRecv?.request?.file !== null">
          ไฟล์: {{ reqRecvStore.currentReqRecv?.request?.file }}
        </div>
        <div>
          วันที่ส่งคำร้อง:
          {{ formatDate(reqRecvStore.currentReqRecv?.createdAt!.toString() || "") }}
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>
