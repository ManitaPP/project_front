<script lang="ts" setup>
import { ref } from "vue";
import { useUserStore } from "../../stores/user.store";

const file = ref<File | null>(null);
const processedImage = ref<string | null>(null);
const originalFile = ref<string | null>(null);
const originalImage = ref<HTMLImageElement | null>(null);
const userStore = useUserStore();

const processImage = async () => {
  if (!file.value) {
    alert("กรุณาเลือกไฟล์");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e: any) => {
    // โหลดไฟล์เป็น URL
    originalFile.value = e.target.result; // นำไฟล์ URL มาเก็บไว้
    const image = new Image();
    image.src = e.target.result;
    image.onload = () => {
      originalImage.value = image;
      applyEdgeDetection(image); // แปลงเป็น URL แล้วนำมาเข้า function เพื่อประมวลผล
    };
  };
  reader.readAsDataURL(file.value);
};

// ฟังก์ชันสำหรับการตรวจจับขอบ
const applyEdgeDetection = (image: HTMLImageElement) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas.width = image.width;
  canvas.height = image.height;

  ctx.drawImage(image, 0, 0, image.width, image.height);

  const src = cv.imread(canvas); // อ่านภาพจาก canvas
  const gray = new cv.Mat();
  const edges = new cv.Mat();

  // แปลงภาพเป็น grayscale
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

  // ใช้ Canny edge detection
  cv.Canny(gray, edges, 50, 150);

  // ทำ morphological closing เพื่อลบช่องว่างหรือขอบที่ไม่สมบูรณ์
  const kernel = cv.Mat.ones(5, 5, cv.CV_8U); // ขนาดของ kernel (ปรับได้ตามต้องการ)
  cv.morphologyEx(edges, edges, cv.MORPH_CLOSE, kernel);

  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

  // หา bounding box รอบๆ ขอบที่ใหญ่ที่สุด
  if (contours.size() > 0) {
    let largestArea = 0;
    let largestIndex = -1;

    // หาพื้นที่ของแต่ละ contour
    for (let i = 0; i < contours.size(); i++) {
      const area = cv.contourArea(contours.get(i));
      if (area > largestArea) {
        largestArea = area;
        largestIndex = i;
      }
    }

    // วาด bounding box รอบๆ ขอบที่ใหญ่ที่สุด
    const boundingRect = cv.boundingRect(contours.get(largestIndex));
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      boundingRect.x,
      boundingRect.y,
      boundingRect.width,
      boundingRect.height
    );

    // ครอปภาพจาก bounding box
    const croppedCanvas = document.createElement("canvas");
    const croppedCtx = croppedCanvas.getContext("2d")!;
    croppedCanvas.width = boundingRect.width;
    croppedCanvas.height = boundingRect.height;
    croppedCtx.drawImage(
      image,
      boundingRect.x,
      boundingRect.y,
      boundingRect.width,
      boundingRect.height,
      0,
      0,
      boundingRect.width,
      boundingRect.height
    );

    // เก็บภาพที่ประมวลผลแล้วในรูปแบบ base64
    processedImage.value = croppedCanvas.toDataURL();
  }

  // ล้าง memory ของ OpenCV
  src.delete();
  gray.delete();
  edges.delete();
  contours.delete();
  hierarchy.delete();
};

const cancel = () => {
  file.value = null;
  processedImage.value = null;
  originalFile.value = null;
  originalImage.value = null;
  userStore.showDialog = false;
};
</script>

<template>
  <v-container align="center" justify="center">
    <v-card class="styled-scrollbar" style="overflow-y: auto; max-height: 80vh">
      <v-card-title>อัปโหลดรูปภาพ</v-card-title>
      <v-card-text>
        <v-file-input
          label="เลือกไฟล์รูปภาพ"
          variant="outlined"
          v-model="file"
          accept="image/*"
          @change="processImage"
        ></v-file-input>
        <v-row v-if="file || processedImage">
          <v-col cols="12" sm="6">
            <div v-if="file">
              <h4>ต้นฉบับ:</h4>
              <img :src="originalFile || ''" style="max-width: 100%" />
            </div>
          </v-col>
          <v-col cols="12" sm="6">
            <div v-if="processedImage">
              <h4>ผลลัพธ์:</h4>
              <img :src="processedImage" style="max-width: 100%" />
            </div>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-btn @click="cancel">ยกเลิก</v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-container>
</template>
