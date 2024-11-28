<script setup lang="ts">
import { inject } from "vue";

const props = defineProps<{
  node: {
    key: string;
    label: string;
    data: string;
    data2: string;
    children: any[];
  };
}>();
const onNodeClick = inject("onNodeClick") as (node: any) => void;
</script>

<template>
  <div class="node">
    <div class="content" @click="onNodeClick(node)">
      <h3>{{ node.data }}</h3>
      <p>{{ node.data2 }}</p>
      <p>{{ node.label }}</p>
    </div>
    <div class="children" v-if="node.children.length > 0">
      <RecursiveNode v-for="child in node.children" :key="child.key" :node="child" />
    </div>
  </div>
</template>

<style scoped>
.node {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 15px;
}

.content {
  padding: 15px;
  border: 2px solid #2c3e50;
  border-radius: 8px;
  background: white;
  min-width: 200px;
  text-align: center;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.content h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1rem;
}

.content p {
  margin: 5px 0 0;
  color: #666;
  font-size: 0.9rem;
}

.children {
  display: flex;
  position: relative;
}

.children::before {
  content: "";
  position: absolute;
  top: -20px;
  left: 50%;
  width: 2px;
  height: 20px;
  background: #2c3e50;
}
</style>
