<script lang="ts" setup>
import { ref, onMounted, nextTick } from "vue";
import HeaderView from "../components/header/headerView.vue";
import SubHeaderView from "../components/header/subHeaderView.vue";
import Tesseract from "tesseract.js";

const file = ref<File | null>(null);
const imageSrc = ref<string | null>(null);
const ocrResult = ref<string>("");
const croppedImages = ref<string[]>([]);

const canvasRef = ref<HTMLCanvasElement | null>(null);

const handleFileChange = () => {
  if (file.value) {
    const reader = new FileReader();
    reader.onload = (event) => {
      imageSrc.value = event.target?.result as string;
      nextTick(() => {
        drawImageOnCanvas();
        performOCR();
      });
    };
    reader.readAsDataURL(file.value);
  }
};

const drawImageOnCanvas = () => {
  if (canvasRef.value && imageSrc.value) {
    const ctx = canvasRef.value.getContext("2d");
    const image = new Image();
    image.src = imageSrc.value;
    image.onload = () => {
      canvasRef.value!.width = image.width;
      canvasRef.value!.height = image.height;
      ctx?.drawImage(image, 0, 0);
    };
  }
};

const cropToBoundingBox = (bbox: any, originalCanvas: HTMLCanvasElement) => {
  const { x0, y0, x1, y1 } = bbox;

  const croppedCanvas = document.createElement("canvas");
  const width = x1 - x0;
  const height = y1 - y0;
  croppedCanvas.width = width;
  croppedCanvas.height = height;

  const ctx = croppedCanvas.getContext("2d");
  if (!ctx) return null;

  ctx.drawImage(originalCanvas, x0, y0, width, height, 0, 0, width, height);

  return croppedCanvas.toDataURL();
};

const performOCR = () => {
  if (!imageSrc.value || !canvasRef.value) return;

  Tesseract.recognize(imageSrc.value, "eng+tha", {
    logger: (info) => console.log(info),
    tessedit_char_blacklist: "0123456789",
    tessedit_enable_doc_dict: "0",
    tessedit_pageseg_mode: "1",
  })
    .then(({ data: { text, words } }) => {
      ocrResult.value = text;
      nextTick(() => {
        const redBoxes = words.filter((word: any) => word.confidence <= 80);
        croppedImages.value = redBoxes
          .map((word: any) => cropToBoundingBox(word.bbox, canvasRef.value!))
          .filter(Boolean);
      });
    })
    .catch((error) => {
      console.error("OCR Error:", error);
      ocrResult.value = "ไม่สามารถตรวจจับตัวอักษรได้";
    });
};
</script>

<template>
  <HeaderView />
  <v-container align="center" justify="center">
    <SubHeaderView style="position: absolute; top: 0; left: 0; z-index: 1" />
    <v-card>
      <v-card-title>อัปโหลดรูปภาพ</v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <v-file-input
              label="เลือกไฟล์รูปภาพ"
              variant="outlined"
              rounded
              v-model="file"
              @change="handleFileChange"
            ></v-file-input>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <canvas
              ref="canvasRef"
              style="max-width: 100%; border: 1px solid #ccc"
            ></canvas>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h3>ผลลัพธ์:</h3>
            <v-row>
              <v-col v-for="(image, index) in croppedImages" :key="index">
                <img :src="image" style="border: 1px solid #000" />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>
