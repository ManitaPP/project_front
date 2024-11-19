<script lang="ts" setup>
import { onMounted, ref } from "vue";
import HeaderView from "../components/header/headerView.vue";
import SubHeaderView from "../components/header/subHeaderView.vue";
import { useUserStore } from "../stores/user.store";
import { useAuthStore } from "../stores/auth.store";
import OrganizationChart from "vue-organization-chart";

const userStore = useUserStore();
const authStore = useAuthStore();
interface TreeNode {
  name: string;
  position?: string;
  children?: TreeNode[];
}

const treeData = ref<TreeNode | null>(null);
onMounted(async () => {
  if (authStore.currentUser) {
    await userStore.getUserByLeader(authStore.currentUser.userId!);
    treeData.value = {
      name: authStore.currentUser.name,
      position: authStore.currentUser.position,
      children: userStore.users.map((user) => ({
        name: user.name,
        position: user.position,
      })),
    };
  }
});
</script>
<template>
  <HeaderView />
  <v-container>
    <SubHeaderView style="position: absolute; top: 0; left: 0; z-index: 1" />
    <v-card align="center" justify="center">
      <v-card-title style="text-align: center">แผนผังองค์กร</v-card-title>
      <v-row>
        <v-col>
          <!-- <v-card style="text-align: center; width: 20%">
            <v-card-title>{{ authStore.currentUser?.name }}</v-card-title>
            <v-card-title>{{ authStore.currentUser?.position }}</v-card-title>
          </v-card> -->
          <!-- <organization-chart></organization-chart> -->
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="(item, index) of userStore.users" :key="index">
          <!-- <v-card style="text-align: center; width: 20%">
            <v-card-title>{{ item.name }}</v-card-title>
            <v-card-title>{{ item.position }}</v-card-title>
          </v-card> -->
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<style scoped>
.organization-chart-node {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.organization-chart-connector {
  border-color: #ddd;
}
</style>
