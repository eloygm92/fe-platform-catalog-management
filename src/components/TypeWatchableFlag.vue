<template>
  <div class="bg-gray-800 rounded-sm opacity-90 w-6 h-6">
    <span class="text-white text-xs flex justify-center py-1">{{ type.toUpperCase() }}</span>
  </div>
</template>

<script setup lang="ts">

  const prop = defineProps({
    type: {
      type: String,
      required: true
    }
  })
</script>

<style scoped>

</style>