<script lang="ts" setup>
import { onMounted, ref } from "vue";
import HeaderView from "../components/header/headerView.vue";
import { useUserStore } from "../stores/user.store";
import * as faceapi from "face-api.js";
import Swal from "sweetalert2";
import cv from "@techstark/opencv-js";

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
    const theta = lines.data32F[i * 2 + 1];
    const angle = (theta * 180) / Math.PI;
    angles.push(angle);
  }
  userStore.loading = true;
  const mostFrequentAngle = calculateMostFrequentAngle(angles);
  const rotated = rotateImage(src, mostFrequentAngle);
  processedImage.value = detectEdgesAgain(rotated, mostFrequentAngle);

  const rotatedImage = new Image();
  rotatedImage.src = processedImage.value!;
  rotatedImage.onload = () => {
    detectFaceOrientation(rotatedImage);
  };

  src.delete();
  gray.delete();
  edges.delete();
  lines.delete();
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

const detectEdgesAgain = (rotated: cv.Mat, angle: number): string => {
  const gray = new cv.Mat();
  const blurred = new cv.Mat();
  const edges = new cv.Mat();
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();

  try {
    cv.cvtColor(rotated, gray, cv.COLOR_RGBA2GRAY, 0);
    cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);
    cv.Canny(blurred, edges, 50, 100);

    cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    let largestArea = 0;
    let largestRect: cv.Rect | null = null;

    for (let i = 0; i < contours.size(); i++) {
      const contour = contours.get(i);
      const rect = cv.boundingRect(contour);
      const area = rect.width * rect.height;

      const isNearEdge =
        rect.x < 10 ||
        rect.y < 10 ||
        rect.x + rect.width > rotated.cols - 10 ||
        rect.y + rect.height > rotated.rows - 10;

      const aspectRatio = rect.width / rect.height;
      const isAbnormalShape = aspectRatio < 0.1 || aspectRatio > 10;

      if (!isNearEdge && !isAbnormalShape && area > largestArea) {
        largestArea = area;
        largestRect = rect;
      }
    }

    if (largestRect) {
      const point1 = new cv.Point(largestRect.x, largestRect.y);
      const point2 = new cv.Point(
        largestRect.x + largestRect.width,
        largestRect.y + largestRect.height
      );
      cv.rectangle(rotated, point1, point2, [255, 255, 255, 255], 10);
      const roi = rotated.roi(largestRect);
      const canvas = document.createElement("canvas");
      cv.imshow(canvas, roi);
      roi.delete();
      return canvas.toDataURL();
    }

    const canvas = document.createElement("canvas");
    cv.imshow(canvas, rotated);
    return canvas.toDataURL();
  } finally {
    gray.delete();
    blurred.delete();
    edges.delete();
    contours.delete();
    hierarchy.delete();
  }
};

const detectFaceOrientation = async (image: HTMLImageElement): Promise<boolean> => {
  let rotationAttempts = 0;
  let finalImage: HTMLImageElement | null = null;
  while (rotationAttempts < 4) {
    const detections = await faceapi
      .detectAllFaces(image, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();
    if (detections.length > 0) {
      const landmarks = detections[0].landmarks;
      const leftEye = landmarks.getLeftEye();
      const rightEye = landmarks.getRightEye();
      const mouth = landmarks.getMouth();

      const eyeAngle = calculateEyeAngle(leftEye, rightEye);
      const mouthAngle = calculateMouthAngle(mouth);

      if (Math.abs(eyeAngle) < 15 && Math.abs(mouthAngle) < 15) {
        finalImage = image;
        userStore.loading = false;
        break;
      }
    }
    image = rotateImageElement(image, 90);
    rotationAttempts++;
  }
  if (finalImage) {
    processedImage1.value = finalImage.src;
    return true;
  } else {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "ไม่สามารถตรวจจับใบหน้าได้",
      showConfirmButton: false,
      timer: 1500,
    });
    userStore.loading = false;
    cancel();
    return false;
  }
};

const calculateEyeAngle = (leftEye: any, rightEye: any): number => {
  const deltaX = rightEye[3].x - leftEye[0].x;
  const deltaY = rightEye[3].y - leftEye[0].y;
  const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  return angle;
};

const calculateMouthAngle = (mouth: any): number => {
  const deltaX = mouth[6].x - mouth[0].x;
  const deltaY = mouth[6].y - mouth[0].y;
  const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  return angle;
};

const rotateImageElement = (image: HTMLImageElement, angle: number): HTMLImageElement => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas.width = image.height;
  canvas.height = image.width;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);

  const rotatedImage = new Image();
  rotatedImage.src = canvas.toDataURL();
  return rotatedImage;
};

const cancel = () => {
  file.value = null;
  processedImage.value = null;
  processedImage1.value = null;
  originalFile.value = null;
  originalImage.value = null;
};

const downloadImage = async () => {
  if (!processedImage1.value) {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "ไม่สามารถดาวน์โหลดไฟล์ได้",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }

  const originalImage = new Image();
  originalImage.src = processedImage1.value;

  originalImage.onload = async () => {
    const targetWidth = 800;
    const targetHeight = Math.floor(
      (originalImage.height / originalImage.width) * targetWidth
    );

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(originalImage, 0, 0, targetWidth, targetHeight);

    let quality = 0.9;
    let resizedBlob: Blob | null = null;
    do {
      resizedBlob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality);
      });
      if (resizedBlob && resizedBlob.size > 512 * 1024) {
        quality -= 0.05;
      } else {
        break;
      }
    } while (resizedBlob && quality > 0.1);

    if (resizedBlob) {
      const resizedImageUrl = URL.createObjectURL(resizedBlob);
      const link = document.createElement("a");
      link.href = resizedImageUrl;
      link.download = "image.jpg";
      link.click();
      URL.revokeObjectURL(resizedImageUrl);
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "ไม่สามารถดาวน์โหลดไฟล์ได้",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
};
</script>

<template>
  <HeaderView />
  <v-container align="center" justify="center" >
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
          width="50vw"
          @change="processImage"
        ></v-file-input>
        <v-row v-if="file || processedImage1">
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
            <div v-if="processedImage1" class="image-container">
              <h4>ผลลัพธ์:</h4>
              <img :src="processedImage1" alt="ผลลัพธ์" class="image-preview" />
              <v-btn
                v-if="processedImage1"
                @click="downloadImage"
                color="black"
                variant="text"
                ><v-icon>mdi-download-circle</v-icon>ดาวน์โหลดไฟล์</v-btn
              >
            </div>
          </v-col>
        </v-row>
        <v-card-actions v-if="file || processedImage1">
          <v-btn @click="cancel">ยกเลิก</v-btn>
        </v-card-actions>
      </v-card-text>                                   
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
