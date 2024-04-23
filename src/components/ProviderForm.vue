<template>
  <el-form v-if="!loader" :model="formData" label-position="top" ref="form">
    <el-row :gutter="24">
      <el-col :span="12">
        <el-form-item label="Nombre del Proveedor" prop="name">
          <el-input v-model="formData.name" placeholder="Nombre del Proveedor" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="ID Externo" prop="external_id">
          <el-input v-model="formData.external_id" placeholder="ID Externo" :disabled="Boolean(props.editData)" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="12">
        <el-form-item label="Logo" prop="logo_path">
          <el-input v-model="formData.logo_path" placeholder="Logo" />
        </el-form-item>
      </el-col>
      <el-col :span="6" :offset="3">
        <el-image
          v-if="formData.logo_path"
          :src="calculateLogo(formData.logo_path)"
          fit="cover"
          style="width: 100px; height: 100px"
        />
      </el-col>
    </el-row>
    <el-divider />
    <ButtonsForm @reset="resetForm(form)" @create="sendChanges" />
  </el-form>
  <el-skeleton v-else v-loading="loader" :rows="14" animated />
</template>

<script setup lang="ts">
import {onBeforeMount, reactive, ref} from "vue";
import {ElMessage, type FormInstance} from "element-plus";
import * as APIHandler from "@/lib/APIHandler";
import ButtonsForm from "@/components/ButtonsForm.vue";

const emit = defineEmits(['update:dialogVisible', 'reload', 'created'])

const props = defineProps({
  editData: {
    type: String,
    default: undefined
  }
})

interface RuleForm {
  id?: number | string
  name: string | undefined
  logo_path: string | undefined
  external_id: string | undefined
  created_at: string | undefined
  updated_at: string | undefined
  deleted_at: string | undefined
}

const form = ref<FormInstance>()
const loader = ref<boolean>(true)
const formData = reactive<RuleForm>({
  id: undefined,
  name: undefined,
  logo_path: undefined,
  external_id: undefined,
  created_at: undefined,
  updated_at: undefined,
  deleted_at: undefined
})

const originalData = ref<any>({
  id: undefined,
  name: undefined,
  logo_path: undefined,
  external_id: undefined,
  created_at: undefined,
  updated_at: undefined,
  deleted_at: undefined
})

onBeforeMount(async () => {

  if (props.editData) {
    const data = await APIHandler.get(`provider/${props.editData}`)
    if (data) {
      originalData.value = Object.assign({}, data)
      formData.id = data.id
      formData.name = data.name
      formData.logo_path = data.logo_path
      formData.external_id = data.external_id
      formData.created_at = data.created_at
      formData.updated_at = data.updated_at
      formData.deleted_at = data.deleted_at
    }
  }

  loader.value = false
})

const calculateLogo = (url_data: string) => {
  return import.meta.env.VITE_IMG_CDN + 'w300/' + url_data
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const sendChanges = async () => {
  if (props.editData) {
    const dataToSend: any = {}
    const formDataCopy: any = Object.assign({}, formData)
    for (const key in formDataCopy) {
      if (formDataCopy[key] !== originalData.value[key]) {
        dataToSend[key] = formDataCopy[key]
      }
    }

    if (Object.keys(dataToSend).length > 0) {
      const response = await APIHandler.patch(`provider/${props.editData}`, dataToSend)
      if (response.status === 200) {
        ElMessage.success('Cambios realizados correctamente')
        emit('update:dialogVisible', false)
        emit('reload')
      } else {
        ElMessage.error('Error al realizar los cambios')
      }
    }
  }
}

</script>

<style scoped>

</style>