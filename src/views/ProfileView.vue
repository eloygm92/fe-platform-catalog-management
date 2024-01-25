<template>
  <el-row :gutter="24">
    <el-col :offset="6" :span="12">
      <UserForm :edit-data="String(userStore.user.id)" @reload="reload++" />
    </el-col>
  </el-row>
</template>

<script setup lang="ts">

import UserForm from "@/components/UserForm.vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

</script>

<style scoped>

</style>