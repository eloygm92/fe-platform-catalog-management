<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    style="fill: #FBBF24;"
    :class="useClass"
  >
    <path d="M19 10.132v-6c0-1.103-.897-2-2-2H7c-1.103 0-2 .897-2 2V22l7-4.666L19 22V10.132z">
    </path>
  </svg>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  checked: {
    type: Boolean,
    required: false
  }
})

const useClass = ref<string>('opacity-30')
const checked = ref<boolean>(props.checked)

if (checked)
  useClass.value = 'opacity-100';
else
  useClass.value = 'opacity-30';
</script>