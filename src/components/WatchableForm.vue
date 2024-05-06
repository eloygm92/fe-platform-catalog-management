<template>
  <el-form v-if="!loader" :model="formData" label-position="top" ref="form">
    <el-row :gutter="24">
      <el-col :span="8">
        <el-form-item value="name" label="Nombre">
          <el-input v-model="formData.name" placeholder="Nombre" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item value="original_name" label="Nombre original">
          <el-input v-model="formData.original_name" placeholder="Nombre original" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item value="external_id" label="ID externo">
          <el-input v-model="formData.external_id" placeholder="ID externo" disabled />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="24">
        <el-input
          type="textarea"
          v-model="formData.overview"
          placeholder="Descripción"
          :rows="4"
          clearable
        />
      </el-col>
    </el-row>
    <el-row :gutter="24" class="mt-2">
      <el-col :span="8">
        <el-form-item value="type" label="Tipo">
          <el-input v-model="formData.type" placeholder="Tipo" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item value="providers" label="Proveedores">
          <el-select v-model="formData.providers" placeholder="Selecciona un proveedor" multiple>
            <el-option
              v-for="item in optionsProvider"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
              <!--              <div class="flex items-center">
                <el-tag
                  :color="item.value"
                  style="margin-right: 8px"
                  size="small"
                >
                  {{ item.label }}
                </el-tag>
              </div>-->
            </el-option>
<!--            <template #tag>
              <el-tag v-for="color in value" :key="color.value" />
            </template>-->
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item value="genres" label="Géneros">
          <el-select v-model="formData.genres" placeholder="Selecciona un género" multiple>
            <el-option
              v-for="item in optionsGenres"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="12">
        <el-form-item value="release_date" label="Fecha de lanzamiento">
          <el-date-picker
            v-model="formData.release_date"
            placeholder="F. de lanzamiento"
            type="date"
            disabled
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item value="poster_path" label="Poster">
          <el-input v-model="formData.poster_path" placeholder="Poster" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="8">
        <el-form-item value="popularity" label="Popularidad">
          <el-input-number v-model="formData.popularity" placeholder="Popularidad" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item value="vote_average" label="Puntuación media">
          <el-input-number
            v-model="formData.vote_average"
            placeholder="Puntuación media"
            disabled
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item value="vote_count" label="Número de votos">
          <el-input-number v-model="formData.vote_count" placeholder="Número de votos" disabled />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="8">
        <el-form-item value="created_at" label="F. de creación">
          <el-date-picker
            v-model="formData.created_at"
            type="datetime"
            placeholder="Fecha de creación"
            format="YYYY/MM/DD hh:mm:ss"
            disabled
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item value="updated_at" label="F. de actualización">
          <el-date-picker
            v-model="formData.updated_at"
            type="datetime"
            placeholder="Fecha de actualización"
            format="YYYY/MM/DD hh:mm:ss"
            disabled
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item value="deactivate_at" label="F. de desactivación">
          <el-date-picker
            v-model="formData.deactivate_at"
            type="datetime"
            placeholder="Fecha de desactivación"
            format="YYYY/MM/DD hh:mm:ss"
            disabled
          />
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
import * as APIHandler from '@/lib/APIHandler'
import { type FormInstance } from 'element-plus'
import compare_elements from '@/lib/compare_elements'
import ButtonsForm from '@/components/ButtonsForm.vue'
import type { IGenre, IProvider } from '@/lib/types/customTypes'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['update:dialogVisible', 'reload'])

const props = defineProps({
  editData: {
    type: String,
    default: undefined
  }
})

interface RuleForm {
  name: string | undefined
  original_name: string | undefined
  external_id: string | undefined
  overview: string | undefined
  vote_average: number | undefined
  vote_count: number | undefined
  popularity: number | undefined
  type: string | undefined
  release_date: string | undefined
  poster_path: string | undefined
  created_at: string | undefined
  updated_at: string | undefined
  deactivate_at: string | undefined
  control: string | undefined
  genres: string[] | undefined
  providers: string[] | undefined
}

const form = ref<FormInstance>()
const loader = ref<boolean>(true)
const formData = reactive<RuleForm>({
  name: undefined,
  original_name: undefined,
  external_id: undefined,
  overview: undefined,
  vote_average: undefined,
  vote_count: undefined,
  popularity: undefined,
  type: undefined,
  release_date: undefined,
  poster_path: undefined,
  created_at: undefined,
  updated_at: undefined,
  deactivate_at: undefined,
  control: undefined,
  genres: undefined,
  providers: undefined
})
const optionsProvider = ref<IProvider[]>([])
const optionsGenres = ref<IGenre[]>([])
const originalData = ref<RuleForm>()

onBeforeMount(async () => {
  if (props.editData) {
    const data = await APIHandler.get('watchable/' + props.editData)
    if (data) {
      originalData.value = Object.assign({}, data)
      formData.name = data.name
      formData.original_name = data.original_name
      formData.external_id = data.external_id
      formData.overview = data.overview
      formData.vote_average = data.vote_average
      formData.vote_count = data.vote_count
      formData.popularity = data.popularity
      formData.type = data.type
      formData.release_date = data.release_date
      formData.poster_path = data.poster_path
      formData.created_at = data.created_at
      formData.updated_at = data.updated_at
      formData.deactivate_at = data.deactivate_at
      formData.control = data.control
      formData.genres = data?.genres.map((item: IGenre) => item.id) ?? []
      formData.providers = data?.provider.map((item: IGenre) => item.id) ?? []
    }

    const response = await APIHandler.get('provider/select')
    if (response) {
      optionsProvider.value = response
    }

    const responseGenres = await APIHandler.get('watchable/genre')
    if (responseGenres) {
      optionsGenres.value = responseGenres
    }
  }

  loader.value = false
})

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const sendChanges = async () => {
  const dataToSend = {}
  for (const key in formData) {
    if (key !== 'genres' && key !== 'providers' && formData[key] !== originalData.value[key]) {
      dataToSend[key] = formData[key]
    } else if (key === 'genres') {
      const genresUsed = optionsGenres.value.filter((item) => formData.genres?.includes(item.id))
      if (!compare_elements(genresUsed, originalData.value[key])) {
        dataToSend[key] = genresUsed
      }
    } else if (key === 'providers' && formData[key]?.length > 0) {
      const providersUsed = optionsProvider.value.filter(
        (item: IProvider) => formData.providers?.includes(String(item.id))
      )
      if (!compare_elements(providersUsed, originalData.value[key])) {
        dataToSend[key] = providersUsed
      }
    }
  }

  if (Object.keys(dataToSend).length > 0) {
    const response = await APIHandler.patch('watchable/' + props.editData, dataToSend)
    if (response.status === 200) {
      ElMessage.success('Cambios realizados correctamente')
      emit('update:dialogVisible', false)
      emit('reload')
    } else {
      ElMessage.error('Error al realizar los cambios')
    }
  }
}
</script>

<style scoped>
.el-input__inner {
  width: 100%;
}
</style>
