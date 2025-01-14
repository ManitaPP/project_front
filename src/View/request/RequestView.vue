<script lang="ts" setup>
import { onMounted } from "vue";
import HeaderView from "../../components/header/headerView.vue";
import router from "../../router";
import { useAuthStore } from "../../stores/auth.store";
import { useRequestTypeStore } from "../../stores/requestType.store";

const authStore = useAuthStore();
const requestTypeStore = useRequestTypeStore();

const goToGeneralRe = () => {
  router.push("/generalRequest");
};

const goToHisRe = () => {
  router.push("/hisRequest");
};

const searchRequest = (name: string) => {
  requestTypeStore.requests = name;
  goToGeneralRe();
};
</script>

<template>
  <HeaderView />
  <v-container>
    <v-card>
      <v-card-title style="text-align: center; font-weight: bold">
        ระบบคำร้อง (Request Management System)</v-card-title
      >
      <v-card-text class="d-flex justify-center">
        <v-img
          class="animated-image"
          src="/public/welcome.png"
          height="100"
          width="100"
          contain
        ></v-img>
      </v-card-text>
      <v-card-text style="text-align: center">
        <div>ผู้ใช้: {{ authStore.currentUser?.name }}</div>
        <div v-if="authStore.currentUser?.role !== 'admin'">
          แผนก: {{ authStore.currentUser?.department?.name }}
          <div v-if="authStore.currentUser?.role !== 'admin'">
            ตำแหน่ง: {{ authStore.currentUser?.position?.name }}
          </div>
        </div>
        <div v-if="authStore.currentUser?.role === 'admin'">ตำแหน่ง: ผู้ดูแลระบบ</div>
        <div
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 20px;
          "
        >
          <v-card-actions v-if="authStore.currentUser?.role !== 'admin'">
            <v-btn @click="goToHisRe">ดูประวัติการส่งคำร้อง</v-btn>
          </v-card-actions>
          <v-card-actions v-if="authStore.currentUser?.role !== 'user'">
            <v-btn>ดูคำร้องที่ถูกส่งมา</v-btn>
          </v-card-actions>
        </div>
      </v-card-text>
      <v-card-text v-if="authStore.currentUser?.role !== 'admin'">
        <v-row>
          <v-col
            ><v-expansion-panels>
              <v-expansion-panel title="คำร้องด้านทรัพยากรบุคคล">
                <v-expansion-panel-text>
                  <v-card-actions>
                    <v-btn
                      class="hover-zoom"
                      variant="tonal"
                      @click="searchRequest('คำร้องขอวันลา')"
                      >คำร้องขอวันลา</v-btn
                    >
                    <v-btn
                      class="hover-zoom"
                      variant="tonal"
                      @click="searchRequest('คำร้องเกี่ยวกับข้อมูลพนักงาน')"
                      >คำร้องเกี่ยวกับข้อมูลพนักงาน</v-btn
                    >
                  </v-card-actions>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels></v-col
          >
          <v-col
            ><v-expansion-panels>
              <v-expansion-panel title="คำร้องด้านการเงิน">
                <v-expansion-panel-text>
                  <v-card-actions>
                    <v-btn
                      class="hover-zoom"
                      variant="tonal"
                      @click="searchRequest('คำร้องขอเบิกเงินล่วงหน้า')"
                      >คำร้องขอเบิกเงินล่วงหน้า</v-btn
                    >
                    <v-btn
                      class="hover-zoom"
                      variant="tonal"
                      @click="searchRequest('คำร้องขออนุมัติค่าใช้จ่าย')"
                      >คำร้องขออนุมัติค่าใช้จ่าย</v-btn
                    >
                  </v-card-actions>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels></v-col
          >
        </v-row>
        <v-row>
          <v-col
            ><v-expansion-panels>
              <v-expansion-panel title="คำร้องด้านงานและโครงการ">
                <v-expansion-panel-text>
                  <v-card-actions>
                    <v-btn
                      class="hover-zoom"
                      variant="tonal"
                      @click="searchRequest('คำร้องขอทรัพยากร')"
                      >คำร้องขอทรัพยากร</v-btn
                    >
                    <v-btn
                      class="hover-zoom"
                      variant="tonal"
                      @click="searchRequest('คำร้องขออนุมัติโครงการ')"
                      >คำร้องขออนุมัติโครงการ</v-btn
                    >
                  </v-card-actions>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels></v-col
          >
          <v-col
            ><v-expansion-panels>
              <v-expansion-panel title="คำร้องด้านไอที">
                <v-expansion-panel-text>
                  <v-card-actions>
                    <v-btn
                      class="hover-zoom"
                      variant="tonal"
                      @click="searchRequest('คำร้องขอซ่อมแซมอุปกรณ์')"
                      >คำร้องขอซ่อมอุปกรณ์</v-btn
                    >
                  </v-card-actions>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels></v-col
          >
        </v-row>
        <v-row>
          <v-col
            ><v-expansion-panels>
              <v-expansion-panel title="คำร้องด้านการประชาสัมพันธ์">
                <v-expansion-panel-text>
                  <v-card-actions>
                    <v-btn
                      class="hover-zoom"
                      variant="tonal"
                      @click="searchRequest('คำร้องขอจัดอีเวนต์')"
                      >คำร้องขอจัดงานอีเวนต์</v-btn
                    >
                  </v-card-actions>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels></v-col
          >
          <v-col
            ><v-expansion-panels>
              <v-expansion-panel title="คำร้องด้านอื่นๆ">
                <v-expansion-panel-text>
                  <v-card-actions>
                    <v-btn
                      class="hover-zoom"
                      variant="tonal"
                      @click="searchRequest('คำร้องขออื่นๆ')"
                      >คำร้องขออื่นๆ</v-btn
                    >
                  </v-card-actions>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels></v-col
          >
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style>
.animated-image {
  animation: float 3s infinite;
}

@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}

.hover-zoom {
  transition: transform 0.3s ease; /* เพิ่มความนุ่มนวลในการเปลี่ยนแปลง */
}

.hover-zoom:hover {
  transform: scale(1.1); /* ขยายขนาดปุ่มเมื่อเมาส์ชี้ */
}
</style>
