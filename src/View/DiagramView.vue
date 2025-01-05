<script setup lang="ts">
import { ref, onMounted, watch, provide, computed } from "vue";
import { useUserStore } from "../stores/user.store";
import { useAuthStore } from "../stores/auth.store";
import HeaderView from "../components/header/headerView.vue";
import SubHeaderView from "../components/header/subHeaderView.vue";
import RecursiveNode from "../components/RecursiveNode.vue";
import ViewDialog from "../components/dialog/viewDialog.vue";
import draggable from "vuedraggable";

const userStore = useUserStore();
const authStore = useAuthStore();
const showDataAll = ref(true);
const showData = ref(false);
const show = ref(false);
const selectedNode = ref<TreeNode | null>(null);

const onNodeClick = (node: TreeNode) => {
  selectedNode.value = node;
  userStore.showDialog = true;
  userStore.name = node.label;
};
provide("onNodeClick", onNodeClick);

watch([showDataAll, showData], async ([newShowDataAll, newShowData]) => {
  if (authStore.currentUser) {
    if (newShowDataAll) {
      await userStore.getPositionByLeader(authStore.currentUser.userId!);
      data.value.children = userStore.users.map((user) => constructNode(user));
    }
    if (newShowData) {
      await userStore.getUserByLeader(authStore.currentUser.userId!);
      data.value.children = userStore.users.map((user) => constructNode(user));
    }
  }
});

const currentUser = ref({
  id: 1,
  position: authStore.currentUser?.position?.name,
  department: authStore.currentUser?.department?.name,
  name: authStore.currentUser?.name,
  subordinates: [],
});

interface TreeNode {
  key: string;
  type: string;
  label: string;
  data: string;
  data2: string;
  children: TreeNode[];
}

const data = ref<{ children: TreeNode[] }>({ children: [] });

const constructNode = (user: any) => {
  const node = {
    key: `node_${user.userId}`,
    type: "person",
    label: `${user.name}`,
    data: user.position?.name,
    data2: user.department?.name,
    children: [],
  };
  if (user.subordinates && user.subordinates.length > 0) {
    node.children = user.subordinates.map((subordinate) => constructNode(subordinate));
  }
  return node;
};

onMounted(async () => {
  if (authStore.currentUser && showDataAll.value) {
    await userStore.getPositionByLeader(authStore.currentUser.userId!);
    data.value.children = userStore.users.map((user) => constructNode(user));
  } else if (authStore.currentUser && showData.value) {
    await userStore.getUserByLeader(authStore.currentUser.userId!);
    data.value.children = userStore.users.map((user) => constructNode(user));
  }
  if (authStore.currentUser?.role === "admin") {
    await userStore.getLeaderByPriority(1);
    data.value.children = userStore.users.map((user) => constructNode(user));
  }
  await userStore.getUsersLeaderAllNull();
});
const showDataInDialog = (name: string) => {
  userStore.showDialog = true;
  userStore.name = name;
};
const usersWithoutLeader = computed(() => {
  return userStore.userLeaderNull.filter((user) => user.leaderId === null);
});
</script>

<template>
  <HeaderView />
  <v-container>
    <SubHeaderView style="position: absolute; top: 0; left: 0; z-index: 1" />
    <v-row>
      <v-col>
        <v-card class="styled-scrollbar" style="overflow-y: auto; max-height: 80vh">
          <div class="tree-container">
            <h1 style="text-align: center">แผนผังองค์กร</h1>
            <v-card-title>
              <v-card v-if="authStore.currentUser?.role === 'admin'">
                <v-card-title class="d-flex justify-space-between align-center">
                  User ที่ยังไม่มีหัวหน้า
                  <v-card-actions class="ma-0 pa-0">
                    <v-btn
                      :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                      @click="show = !show"
                    >
                      <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card-title>
                <v-expand-transition>
                  <div v-show="show">
                    <v-divider></v-divider>
                    <v-card-text>
                      <div
                        class="node root"
                        v-for="user in usersWithoutLeader"
                        :key="user.userId"
                      >
                        <div class="content" @click="showDataInDialog(user.name)">
                          <h3>{{ user.position?.name }}</h3>
                          <p>{{ user.department?.name }}</p>
                          <p>{{ user.name }}</p>
                        </div>
                      </div>
                    </v-card-text>
                    <v-card-text v-if="usersWithoutLeader.length === 0">
                      <h3 style="text-align: center; color: red">ไม่มีข้อมูล User</h3>
                    </v-card-text>
                  </div>
                </v-expand-transition>
              </v-card>
            </v-card-title>
            <v-card-text v-if="authStore.currentUser?.role === 'user'">
              <div class="custom-btn-group">
                <v-btn
                  :color="showDataAll ? '#E8BCB9' : '#FFF4B7'"
                  @click="
                    () => {
                      showDataAll = true;
                      showData = false;
                    }
                  "
                >
                  แสดงตำแหน่งทั้งหมด
                </v-btn>
                <v-btn
                  :color="showData ? '#E8BCB9' : '#FFF4B7'"
                  @click="
                    () => {
                      showData = true;
                      showDataAll = false;
                    }
                  "
                >
                  แสดงตำแหน่ง 1 ระดับ
                </v-btn>
              </div>
            </v-card-text>
            <div class="org-tree">
              <div class="node root">
                <div v-if="authStore.currentUser?.role === 'admin'">
                  <RecursiveNode
                    v-for="subordinate in data.children"
                    :key="subordinate.key"
                    :node="subordinate"
                  />
                </div>

                <div
                  class="content"
                  v-if="authStore.currentUser?.role === 'user'"
                  @click="showDataInDialog(currentUser.name!)"
                >
                  <h3>{{ currentUser?.position || "แอดมิน" }}</h3>
                  <p>{{ currentUser?.department || "" }}</p>
                  <p>{{ currentUser?.name || "ไม่ระบุ" }}</p>
                </div>

                <div class="children" v-if="authStore.currentUser?.role === 'user'">
                  <RecursiveNode
                    v-for="subordinate in data.children"
                    :key="subordinate.key"
                    :node="subordinate"
                  />
                </div>
              </div>
            </div>
          </div>
          <v-dialog v-model="userStore.showDialog" max-width="600px">
            <ViewDialog :node="selectedNode" />
          </v-dialog>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.custom-btn-group {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.tree-container {
  padding: 2rem;
}

.org-tree {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.node {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 15px;
}

.content {
  padding: 15px;
  border: 2px solid #2c3e50;
  border-radius: 8px;
  background: white;
  min-width: 200px;
  text-align: center;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.content h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1rem;
}

.content p {
  margin: 5px 0 0;
  color: #666;
  font-size: 0.9rem;
}

.children {
  display: flex;
  position: relative;
}

.children::before {
  content: "";
  position: absolute;
  top: -20px;
  left: 50%;
  width: 2px;
  height: 20px;
  background: #2c3e50;
}

.node .children .node::before {
  content: "";
  position: absolute;
  top: -20px;
  left: 50%;
  width: 2px;
  height: 20px;
  background: #2c3e50;
}

.root > .content {
  background: #2c3e50;
  color: white;
}

.root > .content h3,
.root > .content p {
  color: white;
}

.icons {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 5px;
}

.edit-icon {
  cursor: pointer;
}

.expand-icon {
  cursor: pointer;
}
</style>
