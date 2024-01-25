<template>
  <el-form v-if="!loader" :model="formData" label-position="top" ref="form">
    <el-row :gutter="24">
      <el-col :span="24">
        <el-form-item label="Nombre de Usuario" prop="username">
          <el-input v-model="formData.username" placeholder="nick" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="24">
        <el-form-item label="Email" prop="email">
          <el-input v-model="formData.email" placeholder="Email" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="!props.editData" :gutter="24">
      <el-col :span="24">
        <el-form-item label="Contraseña" prop="password">
          <el-input type="password" v-model="formData.password" placeholder="Contraseña" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="props.editData" :gutter="24">
      <el-col :span="24">
        <el-form-item label="Rol" prop="role">
          <el-select v-model="formData.role" placeholder="Rol">
            <el-option
              v-for="item in optionRoles"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
<!--    <el-row :gutter="24">
      <el-col :span="6">
        <div class="flex justify-center"><span>Avatar Actual</span></div>
        <el-image :close-on-press-escape="true" :src="formData?.avatar_img ? formData.avatar_img : default_image" />
      </el-col>
      <el-col :span="6">
        <div class="flex justify-center"><span>Avatar Nuevo</span></div>
        <el-image :close-on-press-escape="true" :src="formData?.newImage ? formData.newImage : default_image" />
      </el-col>
      <el-col :span="12">
        <el-form-item label="Avatar" prop="avatar">
&lt;!&ndash;          <el-input v-model="formData.avatar" placeholder="Avatar" />&ndash;&gt;
          <el-upload drag accept="'jpg','png','jpeg','bmp'" :auto-upload="false" >
            <div class="el-upload__text">
              Arrastre aquí los ficheros o <br/><em>haga click para subirlos</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                Los archivos jpg/png deben ser menores a 500kb
              </div>
            </template>
          </el-upload>
          <el-button type="primary" @click="previewChanges">Mostrar cambio</el-button>
        </el-form-item>
      </el-col>
    </el-row>-->
    <el-divider />
    <ButtonsForm @reset="resetForm(form)" @create="sendChanges" />
  </el-form>
  <el-skeleton v-else v-loading="loader" :rows="14" animated />
</template>

<script setup lang="ts">
import { onBeforeMount, reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import * as APIHandler from '@/lib/APIHandler'
import ButtonsForm from '@/components/ButtonsForm.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const emit = defineEmits(['update:dialogVisible', 'reload', 'created'])

const props = defineProps({
  editData: {
    type: String,
    default: undefined
  }
})

interface RuleForm {
  username: string | undefined
  password: string | undefined
  email: string | undefined
  role: string | undefined
  created_at: string | undefined
  updated_at: string | undefined
  deactivate_at: string | undefined
/*  newImage: string | undefined
  undefined: string | undefined*/
}

//const default_image = ref<string>(import.meta.env.VITE_CIRCLE_AVATAR_IMG)
const form = ref<FormInstance>()
const loader = ref<boolean>(true)
const formData = reactive<RuleForm>({
  username: undefined,
  password: undefined,
  email: undefined,
  created_at: undefined,
  updated_at: undefined,
  deactivate_at: undefined,
  role: undefined/*,
  newImage: undefined,
  avatar: undefined*/
})
const optionRoles = ref<object[]>([])
const originalData = ref<object>(undefined)

onBeforeMount(async () => {
  if (props.editData) {
    const data = await APIHandler.get('user/' + props.editData)
    if (data) {
      originalData.value = Object.assign({}, data)
      formData.username = data.username
      formData.email = data.email
      formData.role = data.role.name
      formData.created_at = data.created_at
      formData.updated_at = data.updated_at
      formData.deactivate_at = data.deactivate_at
    }
  }

  const responseRole = await APIHandler.get('user/roles')
  if (responseRole) optionRoles.value = responseRole

  loader.value = false
})

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const previewChanges = () => {
  const file = formData.avatar
  console.log(formData)
  if (file) {
    const createBlob = new Blob([file], { type: 'image/jpeg' });
    formData.newImage = URL.createObjectURL(createBlob);
    console.log(formData.newImage)
  }
}

const sendChanges = async () => {
  if (props.editData) {
    const dataToSend = {}
    for (const key in formData) {
      if (key !== 'role' && formData[key] !== originalData.value[key]) {
        dataToSend[key] = formData[key]
      } else if (key === 'role') {
        const roleFound = optionRoles.value.find((item) => item.id === formData[key])
        if (roleFound && roleFound.id !== originalData.value[key].id) {
          dataToSend[key] = roleFound
        }
      }
    }

    if (Object.keys(dataToSend).length > 0) {
      const response = await APIHandler.patch('user/' + props.editData, dataToSend)
      if (response.status === 200) {
        ElMessage.success('Cambios realizados correctamente')
        emit('update:dialogVisible', false)
        emit('reload')
      } else {
        ElMessage.error('Error al realizar los cambios')
      }
    }
  } else {
    const response = await APIHandler.post('auth/signup', formData)
    if (response.status === 201) {
      ElMessage.success('Usuario creado correctamente')
      const responseData = response.json()
      userStore.setUser(responseData)
      emit('created')
    } else {
      ElMessage.error('Error al crear el usuario')
    }
  }
}
</script>

<style scoped>
.el-select {
  width: 100%;
}
</style>
