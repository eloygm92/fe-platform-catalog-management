<template>
  <el-dialog
    v-model="visible"
    width="40%"
    destroy-on-close
    center
    @closed="closedModal"
    @update:dialog-visible="$emit('update:dialogVisible', $event)"
  >
    <slot />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:dialogVisible'])
const visible = ref<boolean>(props.dialogVisible)
const closedModal = () => {
  emit('update:dialogVisible', false)
}
</script>

<style scoped></style>
