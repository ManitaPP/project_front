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
const selectedDepartment = ref("ไม่เลือกแผนก");
const selectedPosition = ref("ไม่เลือกตำแหน่ง");
const search = ref("");
const currentPage = ref(1);
const itemsPerPage = 10;

const departmentOptions = computed(() => {
  const uniqueDepartments = new Set(
    userStore.users
      .map((u) => u.department?.name)
      .filter((name) => name !== undefined && name !== null)
  );
  return ["ไม่เลือกแผนก", "ไม่สามารถระบุได้", ...Array.from(uniqueDepartments)];
});

const positionOptions = computed(() => {
  const uniquePositions = new Set(
    userStore.users
      .map((u) => u.position?.name)
      .filter((name) => name !== undefined && name !== null)
  );

  if (selectedDepartment.value !== "ไม่เลือกแผนก") {
    uniquePositions.delete("CEO");
  }

  return ["ไม่เลือกตำแหน่ง", "ไม่สามารถระบุได้", ...Array.from(uniquePositions)];
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredUsers.value.slice(start, end);
});

const filteredUsers = computed(() => {
  return userStore.users
    .filter((user) => {
      const matchesRole = !selectedRole.value || user.role === selectedRole.value;
      const matchesDepartment =
        !selectedDepartment.value ||
        selectedDepartment.value === "ไม่เลือกแผนก" ||
        (selectedDepartment.value === "ไม่สามารถระบุได้" && user.departmentId === null) ||
        user.department?.name === selectedDepartment.value;
      const matchesPosition =
        !selectedPosition.value ||
        selectedPosition.value === "ไม่เลือกตำแหน่ง" ||
        (selectedPosition.value === "ไม่สามารถระบุได้" && user.positionId === null) ||
        user.position?.name === selectedPosition.value;
      return matchesRole && matchesDepartment && matchesPosition;
    })
    .sort((a, b) => {
      if (a.position?.name === "CEO" && b.position?.name !== "CEO") return -1;
      if (a.position?.name !== "CEO" && b.position?.name === "CEO") return 1;
      if (a.deletedAt === null && b.deletedAt !== null) return -1;
      if (a.deletedAt !== null && b.deletedAt === null) return 1;
      if (a.department?.name === b.department?.name) {
        return (a.position?.priority ?? Infinity) - (b.position?.priority ?? Infinity);
      }

      return 0;
    });
});

const searchData = () => {
  if (search.value.trim() === "") {
    userStore.getAllUsers();
  } else {
    currentPage.value = 1;
    userStore.searchUsers(search.value);
  }
};

onMounted(async () => {
  await userStore.getAllUsers();
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
  await userStore.getAllUsers();
};
const reUser = (id: number) => {
  Swal.fire({
    title: "ต้องการที่จะคืนสถานะผู้ใช้ใช่หรือไม่?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "ยืนยัน",
    cancelButtonText: "ยกเลิก",
  }).then(async (result) => {
    if (result.isConfirmed) {
      userStore.reUser(id);
      Swal.fire({
        title: "คืนสถานะสำเร็จ!",
        text: "ผู้ใช้สามารถกลับมาใช้งานได้แล้ว",
        icon: "success",
      });
      await userStore.getAllUsers();
    }
  });
};
</script>

<template>
  <HeaderView />
  <v-container>
    <SubHeaderView style="position: absolute; top: 0; left: 0; z-index: 1" />
    <v-row>
      <v-col col="12">
        <v-card class="glass-card">
          <v-card-title style="text-align: center"
            >ข้อมูลผู้ใช้ทั้งหมด
            <v-icon style="margin-left: 1%; margin-bottom: 1%">mdi-account-group</v-icon>
          </v-card-title>
          <v-card-text>
            <v-row class="align-center justify-space-between">
              <v-col cols="12" md="2">
                <v-select
                  v-model="selectedRole"
                  :items="['admin', 'user']"
                  variant="outlined"
                  label="เลือกบทบาท"
                  dense
                  rounded
                ></v-select>
              </v-col>
              <v-col cols="12" md="2" v-if="selectedRole === 'user'">
                <v-select
                  v-model="selectedDepartment"
                  :items="departmentOptions"
                  variant="outlined"
                  label="เลือกแผนก"
                  dense
                  rounded
                ></v-select>
              </v-col>
              <v-col cols="12" md="2" v-if="selectedRole === 'user'">
                <v-select
                  v-model="selectedPosition"
                  :items="positionOptions"
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
                  prepend-inner-icon="mdi-magnify"
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
                <tr style="background-color: #6a669d">
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
                  <th style="text-align: center">สถานะ</th>
                  <th style="text-align: center"></th>
                </tr>
              </thead>
              <tbody
                v-if="paginatedUsers.length > 0"
                v-for="(item, index) in paginatedUsers"
                :key="index"
                style="overflow-y: scroll"
                class="hover-class"
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
                  <td
                    style="text-align: center; display: flex; align-items: center"
                    v-if="item.deletedAt === null"
                  >
                    <v-img src="/public/round.png" width="10" height="10"></v-img>
                    กำลังใช้งาน
                  </td>
                  <td
                    style="text-align: center; display: flex; align-items: center"
                    v-if="item.deletedAt !== null"
                  >
                    <v-img src="/public/roundRed.png" width="10" height="10"></v-img
                    >ไม่ได้ใช้งาน
                  </td>
                  <td style="text-align: center" v-if="item.deletedAt === null">
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
                  <td align="center" v-if="item.deletedAt !== null">
                    <v-btn rounded color="#F0A4AC" @click="reUser(item.userId!)"
                      ><v-icon>mdi-restore</v-icon></v-btn
                    >
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="7" style="text-align: center; color: red">ไม่พบข้อมูล</td>
                </tr>
              </tbody>
            </v-table>
            <v-pagination
              v-model="currentPage"
              :length="Math.ceil(filteredUsers.length / itemsPerPage)"
              total-visible="5"
              class="mt-4"
            ></v-pagination>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.hover-class:hover {
  background-color: #b3c8cf;
  cursor: pointer;
}
</style>
