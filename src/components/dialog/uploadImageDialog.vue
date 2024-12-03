<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useUserStore } from "../../stores/user.store";
import * as faceapi from "face-api.js";

const file = ref<File | null>(null);
const processedImage = ref<string | null>(null);
const originalFile = ref<string | null>(null);
const originalImage = ref<HTMLImageElement | null>(null);
const userStore = useUserStore();

const loadModels = async () => {
  await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
  await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
};
onMounted(async () => {
  await loadModels();
});

const isBlueBackground = (image: HTMLImageElement): boolean => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas.width = image.width;
  canvas.height = image.height;

  ctx.drawImage(image, 0, 0, image.width, image.height);

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  let bluePixels = 0;
  const totalPixels = imgData.width * imgData.height;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    if (b > 150 && b > r && b > g) {
      bluePixels++;
    }
  }

  const bluePercentage = (bluePixels / totalPixels) * 100;
  return bluePercentage > 40;
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
      if (isBlueBackground(image)) {
        processedImage.value = originalFile.value;
      } else {
        applyShadowDetection(image);
      }
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
  const thresh = new cv.Mat();

  // Convert to Grayscale
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

  // Apply Adaptive Thresholding
  cv.adaptiveThreshold(
    gray,
    thresh,
    255,
    cv.ADAPTIVE_THRESH_MEAN_C,
    cv.THRESH_BINARY_INV,
    15,
    10
  );

  // Find Contours of Shadow Areas
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(thresh, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

  // Crop Largest Shadow Area
  if (contours.size() > 0) {
    let largestArea = 0;
    let largestIndex = -1;
    for (let i = 0; i < contours.size(); i++) {
      const area = cv.contourArea(contours.get(i));
      if (area > largestArea) {
        largestArea = area;
        largestIndex = i;
      }
    }

    const boundingRect = cv.boundingRect(contours.get(largestIndex));
    const padding = 10; // เพิ่มขอบรอบภาพ
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
    const croppedImage = cv.imread(croppedCanvas);
    const rotatedRect = cv.minAreaRect(contours.get(largestIndex));

    let angle = rotatedRect.angle;

    if (rotatedRect.size.width < rotatedRect.size.height) {
      angle += 90;
    }
    console.log(`Object tilt angle: ${angle.toFixed(2)} degrees`);
    const center = new cv.Point(croppedImage.cols / 2, croppedImage.rows / 2);
    let rotateAngle = 0;
    if (angle === 0 || angle === 90 || angle === 180 || angle === 270) {
      rotateAngle = 0;
      console.log("Rotating: ", rotateAngle);
    } else {
      rotateAngle = angle - 90;
      console.log("Rotating image by: ", rotateAngle);
    }
    console.log("มุมที่ต้องหมุน: ", rotateAngle);

    const rotationMatrix = cv.getRotationMatrix2D(center, rotateAngle, 1);
    const rotated = new cv.Mat();
    cv.warpAffine(
      croppedImage,
      rotated,
      rotationMatrix,
      new cv.Size(croppedImage.cols, croppedImage.rows)
    );

    cv.imshow(croppedCanvas, rotated);
    processedImage.value = croppedCanvas.toDataURL();
  }

  // Clean up memory
  src.delete();
  gray.delete();
  thresh.delete();
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
              <h4 style="margin-bottom: 5%">ผลลัพธ์:</h4>
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
