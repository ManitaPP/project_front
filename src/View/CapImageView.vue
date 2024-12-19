<script lang="ts" setup>
import { onMounted, ref } from "vue";
import HeaderView from "../components/header/headerView.vue";
import SubHeaderView from "../components/header/subHeaderView.vue";
import { useUserStore } from "../stores/user.store";
import * as faceapi from "face-api.js";

const file = ref<File | null>(null);
const processedImage = ref<string | null>(null);
const processedImage1 = ref<string | null>(null);
const originalFile = ref<string | null>(null);
const originalImage = ref<HTMLImageElement | null>(null);
const userStore = useUserStore();

onMounted(async () => {
  await loadModels();
});

const loadModels = async () => {
  await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
  await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
};

const processImage = async () => {
  if (!file.value) {
    alert("กรุณาเลือกไฟล์");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e: any) => {
    originalFile.value = e.target.result;
    const image = new Image();
    image.src = e.target.result;
    image.onload = async () => {
      applyShadowDetection(image);
    };
  };
  reader.readAsDataURL(file.value);
};

const applyShadowDetection = async (image: HTMLImageElement) => {
  userStore.loading = true;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0, image.width, image.height);
  const src = cv.imread(canvas);

  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

  const blurred = new cv.Mat();
  cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);

  const edges = new cv.Mat();
  cv.Canny(blurred, edges, 50, 150);

  const lines = new cv.Mat();
  cv.HoughLines(edges, lines, 1, Math.PI / 180, 100);

  const angles: number[] = [];
  for (let i = 0; i < lines.rows; i++) {
    const rho = lines.data32F[i * 2];
    const theta = lines.data32F[i * 2 + 1];
    const angle = (theta * 180) / Math.PI;
    angles.push(angle);

    const a = Math.cos(theta);
    const b = Math.sin(theta);
    const x0 = a * rho;
    const y0 = b * rho;
    const lineLength = 2000;
    const x1 = Math.round(x0 + lineLength * -b);
    const y1 = Math.round(y0 + lineLength * a);
    const x2 = Math.round(x0 - lineLength * -b);
    const y2 = Math.round(y0 - lineLength * a);

    // cv.line(src, new cv.Point(x1, y1), new cv.Point(x2, y2), [255, 0, 0, 255], 2);
  }
  const mostFrequentAngle = calculateMostFrequentAngle(angles);
  console.log("Most Frequent Angle:", mostFrequentAngle);
  const rotated = rotateImage(src, mostFrequentAngle);

  processedImage.value = detectEdgesAgain(rotated);
  src.delete();
  gray.delete();
  edges.delete();
  lines.delete();

  userStore.loading = false;
};

const calculateMostFrequentAngle = (angles: number[]): number => {
  const histogram: Record<number, number> = {};

  angles.forEach((angle) => {
    const roundedAngle = Math.round(angle);
    histogram[roundedAngle] = (histogram[roundedAngle] || 0) + 1;
  });
  let maxCount = 0;
  let mostFrequentAngle = 0;
  for (const [angle, count] of Object.entries(histogram)) {
    if (count > maxCount) {
      maxCount = count;
      mostFrequentAngle = Number(angle);
    }
  }

  return mostFrequentAngle;
};

const rotateImage = (src: cv.Mat, angle: number): cv.Mat => {
  const center = new cv.Point(src.cols / 2, src.rows / 2);
  const rotationMatrix = cv.getRotationMatrix2D(center, angle, 1.0);

  const absCos = Math.abs(rotationMatrix.doubleAt(0, 0));
  const absSin = Math.abs(rotationMatrix.doubleAt(0, 1));
  const newWidth = Math.round(src.rows * absSin + src.cols * absCos);
  const newHeight = Math.round(src.rows * absCos + src.cols * absSin);

  rotationMatrix.doublePtr(0, 2)[0] += newWidth / 2 - center.x;
  rotationMatrix.doublePtr(1, 2)[0] += newHeight / 2 - center.y;

  const rotated = new cv.Mat();
  cv.warpAffine(
    src,
    rotated,
    rotationMatrix,
    new cv.Size(newWidth, newHeight),
    cv.INTER_LINEAR,
    cv.BORDER_CONSTANT,
    new cv.Scalar(255, 255, 255, 255)
  );

  return rotated;
};

const detectEdgesAgain = (rotated: cv.Mat): string => {
  const gray = new cv.Mat();
  const blurred = new cv.Mat();
  const edges = new cv.Mat();

  // แปลงภาพเป็น Grayscale
  cv.cvtColor(rotated, gray, cv.COLOR_RGBA2GRAY, 0);

  // ลด Noise ด้วย GaussianBlur
  cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);

  // ตรวจจับขอบด้วย Canny Edge Detection
  cv.Canny(blurred, edges, 50, 150);

  // หา Contours
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

  let largestArea = 0;
  let largestRect: cv.Rect | null = null;

  // ค้นหา Contour ที่มีขนาดใหญ่ที่สุดที่เปอร์เซ็นต์ของสีเทาน้อยกว่า 70%
  for (let i = 0; i < contours.size(); i++) {
    const contour = contours.get(i);
    const rect = cv.boundingRect(contour);

    const area = rect.width * rect.height;

    // คำนวณเปอร์เซ็นต์ของสีเทาใน Contour นี้
    const grayPercentage = calculateGrayPercentage(rotated, rect);

    // ถ้าเปอร์เซ็นต์ของสีเทาน้อยกว่า 70% และมีขนาดใหญ่ที่สุด
    if (grayPercentage < 70 && area > largestArea) {
      largestArea = area;
      largestRect = rect;
    }
  }

  let croppedImage: string | null = null;

  // ถ้ามี Contour ที่มีขนาดใหญ่ที่สุดและมีเปอร์เซ็นต์สีเทาน้อยกว่า 70%
  if (largestRect) {
    const point1 = new cv.Point(largestRect.x, largestRect.y);
    const point2 = new cv.Point(
      (largestRect as cv.Rect).x + (largestRect as cv.Rect).width,
      largestRect.y + largestRect.height
    );
    cv.rectangle(rotated, point1, point2, [255, 0, 0, 255], 2);

    const cropped = rotated.roi(largestRect);

    const canvasCropped = document.createElement("canvas");
    cv.imshow(canvasCropped, cropped);
    croppedImage = canvasCropped.toDataURL();

    cropped.delete();
  }

  const canvas = document.createElement("canvas");
  cv.imshow(canvas, rotated);

  gray.delete();
  blurred.delete();
  edges.delete();
  contours.delete();
  hierarchy.delete();
  return croppedImage || canvas.toDataURL();
};

const calculateGrayPercentage = (image: cv.Mat, rect: cv.Rect): number => {
  const roi = image.roi(rect);

  let grayPixelCount = 0;
  let totalPixelCount = roi.cols * roi.rows;
  for (let y = 0; y < roi.rows; y++) {
    for (let x = 0; x < roi.cols; x++) {
      const pixel = roi.ucharPtr(y, x);
      if (Math.abs(pixel[0] - pixel[1]) < 10 && Math.abs(pixel[1] - pixel[2]) < 10) {
        grayPixelCount++;
      }
    }
  }

  roi.delete();

  const grayPercentage = (grayPixelCount / totalPixelCount) * 100;
  return grayPercentage;
};

const cancel = () => {
  file.value = null;
  processedImage.value = null;
  originalFile.value = null;
  originalImage.value = null;
};

const downloadImage = () => {
  if (!processedImage.value) {
    alert("ไม่มีผลลัพธ์ให้ดาวน์โหลด");
    return;
  }

  const link = document.createElement("a");
  link.href = processedImage.value;
  link.download = "image.png";
  link.click();
};
</script>

<template>
  <HeaderView />
  <v-container align="center" justify="center">
    <SubHeaderView style="position: absolute; top: 0; left: 0; z-index: 1" />
    <v-card
      class="styled-scrollbar"
      style="overflow-y: auto; max-height: 80vh; position: relative"
    >
      <div
        v-if="userStore.loading"
        class="text-center"
        style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)"
      >
        <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </div>
      <v-card-title>อัปโหลดรูปภาพ</v-card-title>
      <v-card-text>
        <v-file-input
          label="เลือกไฟล์รูปภาพ"
          variant="outlined"
          rounded
          v-model="file"
          accept="image/*"
          @change="processImage"
        ></v-file-input>
        <v-row v-if="file || processedImage">
          <v-col cols="12" sm="6">
            <div v-if="file" class="image-container styled-scrollbar">
              <h4>ต้นฉบับ:</h4>
              <img
                :src="originalFile || ''"
                alt="ต้นฉบับ"
                class="image-preview styled-scrollbar"
              />
            </div>
          </v-col>
          <v-col cols="12" sm="6">
            <div v-if="processedImage" class="image-container">
              <h4>ผลลัพธ์:</h4>
              <img :src="processedImage" alt="ผลลัพธ์" class="image-preview" />
              <v-btn
                v-if="processedImage"
                @click="downloadImage"
                color="black"
                variant="text"
                ><v-icon>mdi-download-circle</v-icon>ดาวน์โหลดไฟล์</v-btn
              >
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

<style scoped>
.v-progress-circular {
  margin: 1rem;
}
.image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 500px;
  height: 500px;
  border: 2px solid #1b201c;
  border-radius: 8px;
  padding: 16px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.image-preview {
  max-width: 80%;
  max-height: 80%;
  object-fit: contain;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
}
</style>
