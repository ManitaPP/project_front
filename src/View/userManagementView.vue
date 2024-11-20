<script setup lang="ts">
import { onMounted, ref } from "vue";
import HeaderView from "../components/header/headerView.vue";
import SubHeaderView from "../components/header/subHeaderView.vue";
import { useUserStore } from "../stores/user.store";
import Swal from "sweetalert2";
import UserEditDialog from "../components/dialog/userEditDialog.vue";
import { User } from "../stores/types/user";
const userStore = useUserStore();

onMounted(async () => {
  await userStore.getUsers();
});

const editUser = (user: User) => {
  userStore.currentUser = user;
  userStore.showDialog = true;
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
        <v-card>
          <v-card-title style="text-align: center"
            >ข้อมูลผู้ใช้ทั้งหมด
            <v-icon style="margin-left: 1%; margin-bottom: 1%">mdi-account-group</v-icon>
          </v-card-title>
          <v-card-text>
            <v-table color="#E9EFEC" style="width: 100%" class="styled-table">
              <thead>
                <tr style="background-color: #e1d7c6">
                  <th style="text-align: center">รหัสบัตรประชาชน</th>
                  <th style="text-align: center">ชื่อ-นามสกุล</th>
                  <th style="text-align: center">อีเมล</th>
                  <th style="text-align: center">เบอร์โทรศัพท์</th>
                  <th style="text-align: center">เพิ่มเติม</th>
                </tr>
              </thead>
              <tbody
                v-for="(item, index) of userStore.users"
                :key="index"
                style="overflow-y: scroll"
              >
                <tr v-if="item.role === 'user'">
                  <td style="text-align: center">{{ item.thaiId }}</td>
                  <td style="text-align: center">{{ item.name }}</td>
                  <td style="text-align: center">{{ item.email }}</td>
                  <td style="text-align: center">{{ item.tel }}</td>
                  <td style="text-align: center">
                    <v-btn style="margin: 5%" @click="editUser(item)" color="#F0EAAC"
                      ><v-icon>mdi-pencil</v-icon></v-btn
                    >
                    <v-btn @click="deleteUser(item.userId!)" color="#F0A4AC"
                      ><v-icon>mdi-trash-can</v-icon></v-btn
                    >
                    <v-dialog v-model="userStore.showDialog">
                      <UserEditDialog />
                    </v-dialog>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
.vertical-divider {
  border-left: 1px solid #e0e0e0;
  /* สีของเส้นแบ่ง */
  height: auto;
  /* ให้สูงตามความสูงของ col */
}
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
