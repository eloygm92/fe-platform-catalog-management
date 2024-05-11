<template>
  <el-form :model="formData" label-position="top" ref="form">
    <div v-if="route.query?.token">
      <el-row :gutter="24">
        <el-col :span="24">
          <span class="text-lg font-semibold">Formulario de cambio de contraseña</span>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="Nueva Contraseña" prop="newPassword">
            <el-input type="password" v-model="formData.newPassword" placeholder="Nueva Contraseña" show-password />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="Confirmar Contraseña" prop="confirmPassword">
            <el-input type="password" v-model="formData.confirmPassword" placeholder="Confirmar Contraseña" :class="inputClass" show-password />
          </el-form-item>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <el-row :gutter="24">
        <el-col :span="24">
          <span class="text-lg font-semibold">Solicitud de cambio de contraseña</span>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="Introduzca email del usuario" prop="email">
            <el-input v-model="formData.email" placeholder="Email" />
          </el-form-item>
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="24">
      <el-col :span="24">
        <el-button type="primary" @click="changePassword">{{ route.query?.token ? 'Cambiar Contraseña' : 'Solicitar' }}</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import { ElNotification} from "element-plus";
import type { FormInstance} from "element-plus";
import {useRoute, useRouter} from "vue-router";
import * as APIHandler from "@/lib/APIHandler";

interface RuleForm {
  email: string | undefined
  newPassword: string | undefined
  confirmPassword: string | undefined
}

const route = useRoute();
const router = useRouter();

const inputClass = ref<string>('')
const form = ref<FormInstance>()
const formData = reactive<RuleForm>({
  email: undefined,
  newPassword: undefined,
  confirmPassword: undefined
})

const changePassword = async () => {
  if (!route.query?.token) {
    const response = await APIHandler.post('auth/forgot-password', {
      email: formData.email
    })

    if (response.status == 200 || response.status == 201) {
      sendNotification()
      setTimeout(() => {
        router.push({name: 'home'})
      }, 750)
    }
  } else {
    if (formData.newPassword != formData.confirmPassword)
      ElMessage.error('Las contraseñas no coinciden')
    else {
      const response = await APIHandler.changePassword('auth/change-password', route.query.token, {
        password: formData.newPassword,
        token: route.query.token
      })
      if (response.ok) {
        ElMessage.success('Contraseña cambiada con éxito')
        await router.push({name: 'home'})
      }
    }
  }
}

const sendNotification = () => {
  ElNotification({
    title: 'Solicitud enviada',
    message: 'Se esta procesando su solicitud, si el correo ingresado es correcto recibirá un correo con las instrucciones para cambiar su contraseña. Revise la carpeta SPAM.',
    type: 'info',
  })
}

</script>

<style scoped>

</style>