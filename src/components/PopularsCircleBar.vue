<template>
  <div class="w-fit bg-gray-900 p-0.5 circle-rounded">
    <el-progress type="circle" :percentage="Math.round(percentage * 10)" :width="30" :color="calculateColor" :stroke-width="3" stroke-linecap="round" >
      <template #default="{ percentage }">
        <span class="text-xs center-circle text-white">{{ percentage }}</span>
      </template>
    </el-progress>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  percentage: {
    type: Number,
    required: true
  }
})

const colorsArray = ref<{ color: string, percentage: number}[]>([
  { color: '#f56c6c', percentage: 0 },
  { color: '#e6ca3c', percentage: 40 },
  { color: '#5cb87a', percentage: 70 }
])

const calculateColor = (percentage: number) => {
  if (percentage < 40)
    return '#f56c6c'
  else if (percentage >= 40 && percentage < 70)
    return '#e6ca3c'
  else
    return '#5cb87a'
}
</script>

<style scoped>
.center-circle {
  margin-left: -1.3rem;
}
.circle-rounded {
  border-radius: 50%;
  height: 2.10rem;
}
</style>