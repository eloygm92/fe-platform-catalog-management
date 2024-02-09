<template>
  <ModalForms
    v-if="dialogVisible"
    :dialog-visible="dialogVisible"
    :title="titleModal"
    @update:dialog-visible="updateVisible"
  >
    <component
      :is="component"
      @update:dialog-visible="updateVisible"
      @reload="reloadData"
      :edit-data="edit_data"
      :key="reloadComponent"
    />
  </ModalForms>
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import ModalForms from '@/components/ModalForms.vue'
import WatchableForm from '@/components/WatchableForm.vue'
import UserForm from '@/components/UserForm.vue'

const emit = defineEmits(['visible', 'reload'])

const props = defineProps({
  componentUse: {
    type: String,
    required: true
  },
  idReference: {
    type: Number,
    required: true
  },
  visible: {
    type: Boolean,
    required: true
  }
})

const selectComponent = (name: string) => {
  switch (name) {
    case 'watchable':
      return WatchableForm
    case 'user':
      return UserForm
  }
}

const dialogVisible = ref<boolean>(props.visible)
const titleModal = ref<string>('')
const component = shallowRef(selectComponent(props.componentUse))
const edit_data = ref<string>(String(props.idReference))
const reloadComponent = ref<number>(0)

const updateVisible = (value: boolean) => {
  dialogVisible.value = value
  emit('visible', value)
}

const reloadData = async () => {
  emit('reload')
}
</script>

<style scoped></style>
