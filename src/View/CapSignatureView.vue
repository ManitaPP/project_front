<script lang="ts" setup>
import { ref, onMounted, nextTick } from "vue";
import HeaderView from "../components/header/headerView.vue";
import SubHeaderView from "../components/header/subHeaderView.vue";
import Tesseract from "tesseract.js";

const file = ref<File | null>(null);
const imageSrc = ref<string | null>(null);
const ocrResult = ref<string>("");

const canvasRef = ref<HTMLCanvasElement | null>(null);

const handleFileChange = () => {
  if (file.value) {
    const reader = new FileReader();
    reader.onload = (event) => {
      imageSrc.value = event.target?.result as string;
      nextTick(() => drawImageOnCanvas());
    };
    reader.readAsDataURL(file.value);

    // Perform OCR after the file is read
    performOCR(file.value);
  }
};

const performOCR = (file: File) => {
  Tesseract.recognize(file, "eng+tha", {
    logger: (info) => console.log(info), // Log OCR progress
  })
    .then(({ data: { text, words } }) => {
      ocrResult.value = text; // Store the recognized text
      nextTick(() => drawTextOnCanvas(words));
    })
    .catch((error) => {
      console.error("OCR Error:", error);
      ocrResult.value = "ไม่สามารถตรวจจับตัวอักษรได้";
    });
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

const drawTextOnCanvas = (words: any[]) => {
  if (canvasRef.value && words) {
    const ctx = canvasRef.value.getContext("2d");
    ctx!.font = "16px Arial";
    ctx!.fillStyle = "red";
    words.forEach((word: any) => {
      const { bbox, text } = word;
      if (bbox) {
        const { x0, y0, x1, y1 } = bbox;
        ctx!.fillText(text, x0, y0 - 5); // Adjust position slightly
        ctx!.strokeStyle = "red";
        ctx!.lineWidth = 1;
        ctx!.strokeRect(x0, y0, x1 - x0, y1 - y0); // Draw bounding box
      }
    });
  }
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
      </v-card-text>
    </v-card>
  </v-container>
</template>
