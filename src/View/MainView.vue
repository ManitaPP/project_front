<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import HeaderView from "../components/header/headerView.vue";
import SubHeaderView from "../components/header/subHeaderView.vue";
import { useUserStore } from "../stores/user.store";
import { useAuthStore } from "../stores/auth.store";
import OrganizationChart from "primevue/organizationchart";
import viewDialog from "../components/dialog/viewDialog.vue";

const userStore = useUserStore();
const authStore = useAuthStore();

interface Node {
  key: string;
  type: string;
  label: string;
  data: string;
  department?: string;
  children: Node[];
}

const data = ref<Node>({
  key: String(authStore.currentUser?.userId) || "",
  type: "person",
  label: authStore.currentUser?.name || "",
  data: authStore.currentUser?.position?.name || "",
  department: authStore.currentUser?.department?.name || "",
  children: [],
});

function constructNode(user) {
  const node = {
    key: `0_${user.userId}`,
    type: "person",
    label: user.name,
    data: user.position.name,
    department: user.department.name,
    children: [],
  };
  if (user.subordinates && user.subordinates.length > 0) {
    node.children = user.subordinates.map((subordinate) => constructNode(subordinate));
  }
  return node;
}

onMounted(async () => {
  if (authStore.currentUser) {
    await userStore.getPositionByLeader(authStore.currentUser.userId!);
    data.value.children = userStore.users.map((user) => constructNode(user));
  }
});
const getNodeStyle = (node) => {
  switch (node) {
    case "หัวหน้าแผนก":
      return {
        backgroundColor: "#E1D7C6",
        color: "#000",
        padding: "10px",
        borderRadius: "8px",
        border: "2px solid #000",
      };
    case "ผู้จัดการ":
      return {
        backgroundColor: "#D0E8C5",
        color: "#000",
        padding: "10px",
        borderRadius: "8px",
        border: "2px solid #000",
      };
    // case "ผู้ช่วยผู้ใหญ่บ้าน":
    //   return {
    //     backgroundColor: "#ADD8E6",
    //     color: "#000",
    //     padding: "10px",
    //     borderRadius: "8px",
    //     border: "2px solid #000",
    //   };
    default:
      return {
        backgroundColor: "#FFF4B7",
        color: "#000",
        padding: "10px",
        borderRadius: "8px",
        border: "2px solid #000",
      };
  }
};

const showDialog = (data: any) => {
  userStore.showDialog = true;
  userStore.name = data;
};
</script>

<template>
  <HeaderView />
  <v-container>
    <SubHeaderView style="position: absolute; top: 0; left: 0; z-index: 1" />
    <v-card align="center" justify="center" style="overflow-y: auto; max-height: 80vh">
      <v-card-title style="text-align: center; font-weight: bold">
        แผนผังองค์กร
      </v-card-title>
      <OrganizationChart :value="data" collapsible>
        <template #person="slotProps">
          <div
            class="flex flex-col items-center"
            :style="getNodeStyle(slotProps.node.data)"
            @click="showDialog(slotProps.node.label)"
          >
            <div class="mt-2 font-medium text-lg">{{ slotProps.node.label }}</div>
            <div class="mt-2 font-medium text-lg">{{ slotProps.node.data }}</div>
            <div class="mt-2 font-medium text-lg">{{ slotProps.node.department }}</div>
          </div>
        </template>
      </OrganizationChart>
      <v-dialog v-model="userStore.showDialog" max-width="600px">
        <viewDialog />
      </v-dialog>
    </v-card>
  </v-container>
</template>
