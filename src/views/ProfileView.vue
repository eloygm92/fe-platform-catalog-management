<template>
  <el-row :gutter="24">
    <el-col :offset="6" :span="12">
      <UserForm :edit-data="String(userStore.user?.id)" @reload="handleReload" />
    </el-col>
  </el-row>
</template>

<script setup lang="ts">

import UserForm from "@/components/UserForm.vue";
import { ref } from "vue";
import { useUserStore } from "@/stores/user";

const emit = defineEmits(['reload']);

const userStore = useUserStore();
const reload = ref<number>(0);

const handleReload = () => {
  reload.value++;
  emit('reload');
};

</script>

<style scoped>

</style>