<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import HeaderView from "../components/header/headerView.vue";
import SubHeaderView from "../components/header/subHeaderView.vue";
import { useUserStore } from "../stores/user.store";
import Swal from "sweetalert2";
import UserEditDialog from "../components/dialog/userEditDialog.vue";
import { User } from "../stores/types/user";
import router from "../router";
const userStore = useUserStore();
const selectedRole = ref("user");
const search = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(4);
const filteredUsers = computed(() => {
  if (!selectedRole.value) {
    return userStore.users.sort((a, b) => {
      if (a.departmentId === null && b.departmentId !== null) return -1;
      if (a.departmentId !== null && b.departmentId === null) return 1;
      return 0;
    });
  }
  return userStore.users
    .filter((user) => user.role === selectedRole.value)
    .sort((a, b) => {
      if (a.departmentId === null && b.departmentId !== null) return -1;
      if (a.departmentId !== null && b.departmentId === null) return 1;
      return 0;
    });
});
// const paginatedUsers = computed(() => {
//   const start = (currentPage.value - 1) * itemsPerPage.value;
//   const end = start + itemsPerPage.value;
//   return filteredUsers.value.slice(start, end);
// });

// const totalPages = computed(() => {
//   return Math.ceil(filteredUsers.value.length / itemsPerPage.value);
// });
const searchData = () => {
  if (search.value.trim() === "") {
    userStore.getUsers();
  } else {
    userStore.searchUsers(search.value);
  }
};

onMounted(async () => {
  await userStore.getUsers();
});

const editUser = (user: User) => {
  userStore.currentUser = user;
  userStore.showDialog = true;
};

const goToPositionView = () => {
  router.push("/position");
};

const deleteUser = async (idUser: number) => {
  Swal.fire({
    title: "ต้องการที่จะลบข้อมูลหรือไม่?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "ยืนยัน",
    cancelButtonText: "ยกเลิก",
  }).then(async (result) => {
    if (result.isConfirmed) {
      userStore.deleteUser(idUser);
      Swal.fire({
        title: "ลบข้อมูลสำเร็จ!",
        text: "ข้อมูลได้ถูกลบเรียบร้อยแล้ว",
        icon: "success",
      });
    }
  });
  await userStore.getUsers();
};
</script>

<template>
  <HeaderView />
  <v-container>
    <SubHeaderView style="position: absolute; top: 0; left: 0; z-index: 1" />
    <v-row>
      <v-col col="12">
        <v-card class="glass-card" style="overflow-y: auto; max-height: 80vh">
          <v-card-title style="text-align: center"
            >ข้อมูลผู้ใช้ทั้งหมด
            <v-icon style="margin-left: 1%; margin-bottom: 1%">mdi-account-group</v-icon>
          </v-card-title>
          <v-card-text>
            <v-row class="align-center justify-space-between">
              <v-col cols="12" md="3">
                <v-select
                  v-model="selectedRole"
                  :items="['admin', 'user']"
                  variant="outlined"
                  label="เลือกตำแหน่ง"
                  dense
                  rounded
                ></v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  label="ค้นหา"
                  variant="outlined"
                  prepend-icon="mdi-magnify"
                  v-model="search"
                  rounded
                  @input="searchData()"
                ></v-text-field>
              </v-col>
              <v-col class="text-right">
                <v-btn
                  color="#D0E8C5"
                  @click="goToPositionView()"
                  prepend-icon="mdi-briefcase"
                  class="mt-0"
                  rounded
                >
                  เพิ่มตำแหน่ง
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text>
            <v-table style="width: 100%" class="styled-table">
              <thead>
                <tr style="background-color: #849fb6">
                  <th style="text-align: center" v-if="selectedRole === 'user'">แผนก</th>
                  <th style="text-align: center" v-if="selectedRole === 'user'">
                    ตำแหน่ง
                  </th>
                  <th style="text-align: center" v-if="selectedRole === 'admin'">
                    รหัสบัตรประชาชน
                  </th>
                  <th style="text-align: center" v-if="selectedRole === 'admin'">
                    เบอร์โทรศัพท์
                  </th>
                  <th style="text-align: center">ชื่อ-นามสกุล</th>
                  <th style="text-align: center">อีเมล</th>
                  <th style="text-align: center"></th>
                </tr>
              </thead>
              <tbody
                v-if="filteredUsers.length > 0"
                v-for="(item, index) in filteredUsers"
                :key="index"
                style="overflow-y: scroll"
              >
                <tr>
                  <!-- <td style="text-align: center">{{ item.thaiId }}</td> -->
                  <td
                    style="text-align: center; color: red"
                    v-if="item.departmentId === null && selectedRole === 'user'"
                  >
                    ไม่สามารถระบุแผนกได้
                  </td>
                  <td
                    style="text-align: center; color: red"
                    v-if="item.positionId === null && selectedRole === 'user'"
                  >
                    ไม่สามารถระบุตำแหน่งได้
                  </td>
                  <td
                    style="text-align: center"
                    v-if="item.departmentId !== null && selectedRole === 'user'"
                  >
                    {{ item.department?.name }}
                  </td>
                  <td
                    style="text-align: center"
                    v-if="item.positionId !== null && selectedRole === 'user'"
                  >
                    {{ item.position?.name }}
                  </td>
                  <td style="text-align: center" v-if="selectedRole === 'admin'">
                    {{ item.thaiId }}
                  </td>
                  <td style="text-align: center" v-if="selectedRole === 'admin'">
                    {{ item.tel }}
                  </td>
                  <td style="text-align: center">{{ item.name }}</td>
                  <td style="text-align: center">{{ item.email }}</td>
                  <!-- <td style="text-align: center">{{ item.tel }}</td> -->
                  <td style="text-align: center">
                    <v-btn
                      style="margin: 5%"
                      rounded
                      @click="editUser(item)"
                      color="#F0EAAC"
                      ><v-icon>mdi-pencil</v-icon></v-btn
                    >
                    <v-btn @click="deleteUser(item.userId!)" rounded color="#F0A4AC"
                      ><v-icon>mdi-trash-can</v-icon></v-btn
                    >
                    <v-dialog v-model="userStore.showDialog">
                      <UserEditDialog />
                    </v-dialog>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="7" style="text-align: center; color: red">ไม่พบข้อมูล</td>
                </tr>
              </tbody>
            </v-table>
            <!-- <v-pagination
              v-model="currentPage"
              :length="totalPages"
              total-visible="4"
              class="mt-4"
            ></v-pagination> -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.styled-table th,
.styled-table td {
  text-align: center;
  border: 1px solid black; /* Add borders to table cells */
}

.styled-table {
  width: 100%;
  border-collapse: collapse; /* Ensures the borders between cells are merged */
}
</style>
