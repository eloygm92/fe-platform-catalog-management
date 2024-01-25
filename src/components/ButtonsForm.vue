<template>
  <div class="flex justify-end">
    <!--    <el-button type="info" @click="$emit('reset')" plain> Reset </el-button>-->
    <el-button type="primary" @click="$emit('create')"> Ok </el-button>
  </div>
</template>

<script setup lang="ts">
defineEmits(['create', 'reset'])
</script>

<style scoped></style>
