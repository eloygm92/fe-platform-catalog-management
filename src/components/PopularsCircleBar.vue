<template>
  <div :class="size === 'small' ? 'w-fit bg-gray-900 p-0.5 circle-rounded' : 'bg-gray-900 pl-0.5 pt-0.5 circle-roundedx2'">
    <el-progress type="circle" :percentage="Math.round(percentage * 10)" :width="widthProgress" :color="calculateColor" :stroke-width="widthStroke" stroke-linecap="round" >
      <template #default="{ percentage }">
        <span :class="textFontSize" >{{ percentage }}</span>
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
  },
  size: {
    type: String,
    default: 'small'
  }
})

const widthProgress = ref<number>(props.size === 'small' ? 30 : 45)
const widthStroke = ref<number>(props.size === 'small' ? 3 : 4)
const textFontSize = ref<number>(props.size === 'small' ? 'text-xs center-circle text-white' : 'text-xl center-circlex2 text-white')

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

.center-circlex2 {
  margin-left: -0.4rem;
  margin-top: -1rem;
}
.circle-rounded {
  border-radius: 50%;
  height: 2.15rem;
}

.circle-roundedx2 {
  border-radius: 50%;
  height: 3.05rem;
  width: 3.05rem;
}
</style>