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
    <el-row v-if="props.editData && userStore.user?.role === 'admin'" :gutter="24">
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
    <el-row :gutter="24">
      <el-col :span="24">
        <el-form-item label="Proveedores" prop="providers" v-model="formData.providers">
          <el-tooltip
            v-for="item in providersList"
            :key="item.id"
            :content="item.name"
            placement="top"
          >
            <el-link @click="enableCheckProvider(item.id)" class="m-1" >
              <img :src="calculateProviderImage(item.logo_path)" :class="item.checked ? 'border border-blue-500' : 'rounded opacity-75'" :id="'provider-tag-' + item.id" :alt="'Logo de ' + item.name">
            </el-link>
          </el-tooltip>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="editData" :gutter="24">
      <el-col :span="6">
        <div class="flex justify-center"><span>Avatar Actual</span></div>
        <el-image :close-on-press-escape="true" :src="formData?.avatar_img ? formData.avatar_img : default_image" />
      </el-col>
      <el-col :span="6">
        <div class="flex justify-center"><span>Avatar Nuevo</span></div>
        <el-image :close-on-press-escape="true" :src="formData?.newImage ? formData.newImage : default_image" class="rounded"/>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Avatar" prop="avatar">
          <el-upload drag accept="'jpg','png','jpeg'" :auto-upload="false" :show-file-list="false" :on-change="previewChanges2">
            <div class="el-upload__text">
              Arrastre aquí los ficheros o <br/><em>haga click para subirlos</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                Los archivos jpg/png deben ser menores a 500kb
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-col>
    </el-row>
    <el-divider />
    <ButtonsForm @reset="resetForm(form)" @create="sendChanges" />
  </el-form>
  <el-skeleton v-else v-loading="loader" :rows="14" animated />
</template>

<script setup lang="ts">
import { onBeforeMount, reactive, ref } from 'vue'
import type {FormInstance, UploadFile, UploadFiles} from 'element-plus'
import * as APIHandler from '@/lib/APIHandler'
import ButtonsForm from '@/components/ButtonsForm.vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import type { IProvider, IRole } from '@/lib/types/customTypes'
import getWatchlist from "@/lib/watchlistData";

const userStore = useUserStore()

const emit = defineEmits(['update:dialogVisible', 'reload', 'created'])

const props = defineProps({
  editData: {
    type: String,
    default: undefined
  }
})

interface RuleForm {
  id?: number| string
  username: string | undefined
  password: string | undefined
  email: string | undefined
  role: string | undefined | IRole
  created_at: string | undefined
  updated_at: string | undefined
  deactivate_at: string | undefined
  providers: IProvider[]
  newImage: string | undefined
  avatar_img: string | undefined
}

const default_image = ref<string>(import.meta.env.VITE_CIRCLE_AVATAR_IMG)
const aux_image = ref<Blob | undefined>()
const providersList = ref<IProvider[]>([])
const form = ref<FormInstance>()
const loader = ref<boolean>(true)
const formData = reactive<RuleForm>({
  id: undefined,
  username: undefined,
  password: undefined,
  email: undefined,
  created_at: undefined,
  updated_at: undefined,
  deactivate_at: undefined,
  role: undefined,
  providers: [],
  newImage: undefined,
  avatar_img: undefined
})
const optionRoles = ref<IRole[]>([])
const originalData = ref<any>({
  id: undefined,
  username: undefined,
  password: undefined,
  email: undefined,
  created_at: undefined,
  updated_at: undefined,
  deactivate_at: undefined,
  role: undefined,
  providers: [],
  newImage: undefined,
  avatar_img: undefined
})

const enableCheckProvider = (id: number | string) => {
  providersList.value = providersList.value.map(item => {
    if (item.id === id) {
      item.checked = !item.checked
    }
    if (item.checked) {
      document.getElementById('provider-tag-' + item.id)?.classList.add('border','border-blue-500')
      document.getElementById('provider-tag-' + item.id)?.classList.remove('opacity-75')
      //formData.providers.push(item);
    } else {
      //formData.providers = formData.providers.filter(elem => item.id !== elem.id)
      document.getElementById('provider-tag-' + item.id)?.classList.remove('border','border-blue-500', 'opacity-75')
      document.getElementById('provider-tag-' + item.id)?.classList.add('opacity-75')
    }
    return item
  })
  formData.providers = providersList.value
    .filter(item => item.checked)
    .map(item => {
      const {checked, ...rest} = item
      return rest
    })
}

const calculateProviderImage = (url: string) => {
  return import.meta.env.VITE_IMG_CDN + 'w45' + url
}

onBeforeMount(async () => {

  const providers = await APIHandler.get(`provider/select`)
  if (providers) {
    providersList.value = providers.map((provider: IProvider) => {
      return {checked: false, ...provider}
    })
  }

  if (props.editData) {
    await getUserData();
  }

  const responseRole = await APIHandler.get('user/roles')
  if (responseRole) optionRoles.value = responseRole

  loader.value = false
})

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const previewChanges2 = async (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  if (uploadFile) {
    aux_image.value = await adaptResultToBase64(uploadFile.raw)
    formData.newImage = URL.createObjectURL(uploadFile.raw);
  } else {
    aux_image.value = undefined
  }
}

const sendChanges = async () => {
  if (props.editData) {
    const dataToSend: any = {}
    const formDataCopy: any = Object.assign({}, formData)
    for (const key in formDataCopy) {
      if (key !== 'role' && key !== 'providers' && key !== 'newImage' && key !== 'avatar_img' && formDataCopy[key] !== originalData.value[key]) {
        dataToSend[key] = formDataCopy[key]
      } else if (key === 'role') {
        const roleFound = optionRoles.value.find((item) => item.id === formDataCopy[key])
        if (roleFound &&  roleFound.id != originalData.value[key]?.id) {
          dataToSend[key] = roleFound
        }
      } else if (key === 'providers') {
        if (formDataCopy[key].length !== originalData.value[key].length) {
          dataToSend[key] = formDataCopy[key]?.reduce((acc, item: IProvider) => {
            /*if (item.checked) {
              const {checked, ...rest} = item
              acc.push(rest)
            }*/
            if (item) {
              acc.push(item)
            }
            return acc
          },[])
        }
      } else if (key === 'newImage' && formDataCopy[key]) {
        dataToSend['avatar_img'] = aux_image.value
      } else if (key === 'avatar_img') {}
    }

    if (Object.keys(dataToSend).length > 0) {
      const response = await APIHandler.patch('user/' + props.editData, dataToSend)
      if (response.status === 200) {
        ElMessage.success('Cambios realizados correctamente')
        userStore.setUser(await response.json())
        await getUserData()
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
      const responseData = await response.json()
      userStore.setUser(responseData)
      await getWatchlist()
      emit('created')
    } else {
      ElMessage.error('Error al crear el usuario')
    }
  }
}

const adaptResultToBase64 = (file: Blob) => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const getUserData = async () => {
  const data: any = await APIHandler.get('user/' + props.editData)
  if (data) {
    originalData.value = Object.assign({}, data)
    formData.username = data.username
    formData.email = data.email
    formData.role = data.role.name
    formData.created_at = data.created_at
    formData.updated_at = data.updated_at
    formData.deactivate_at = data.deactivate_at
    if (data.avatar_img) {
      //formData.avatar_img = URL.createObjectURL(data.avatar_img)
      formData.avatar_img = data.avatar_img
    }
    //formData.providers = data.providers
    if (data.providers.length > 0) {
      for (const provider of data.providers) {
        enableCheckProvider(provider.id)
      }
    }
    formData.newImage = undefined
    formData.avatar = undefined
  }
}
</script>

<style scoped>
.el-select {
  width: 100%;
}
</style>
