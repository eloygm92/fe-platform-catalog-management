<template>
  <div class="flex flex-row">
    <el-table v-if="data.length > 0" :data="data" stripe>
      <el-table-column
        v-for="item in Object.keys(data[0])"
        :key="item"
        :prop="item"
        :label="calcLabel(item)"
        :formatter="formatterText"
        :width="item === 'id' ? 100 : 190"
      >
        <template #header>
          <span class="header-column flex justify-center">{{ calcLabel(item) }}</span>
        </template>
        <template #default="{ row, column, $index }">
          <el-popover
            v-if="column.property === 'overview'"
            placement="top-start"
            width="500"
            trigger="hover"
            :content="formatterText(row, column, row[column.property], $index)"
          >
            <template #reference>
              <span class="truncateText">{{
                formatterText(row, column, row[column.property], $index)
              }}</span>
            </template>
          </el-popover>
          <!--          <span v-else-if="column.property === 'overview'" class="truncateText" >{{ formatterText(row, column, row[column.property], $index) }}</span>-->
          <img
            v-else-if="(column.property === 'poster_path' || column.property === 'logo_path') && row[column.property]"
            :src="calcUrlImg(row[column.property])"
            alt="poster"
            class="ml-12 w-20 h-20 rounded"
          />
          <div v-else class="text-personal flex justify-center">
            {{ formatterText(row, column, row[column.property], $index) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="140">
        <template #header>
          <span class="header-column flex justify-center">Acciones</span>
        </template>
        <template #default="scope">
          <el-tooltip content="Editar" placement="top">
            <el-button
              link
              type="primary"
              size="small"
              @click.prevent="editElem(scope['row']['id'])"
            >
              <IconEdit />
            </el-button>
          </el-tooltip>
          <el-tooltip
            v-if="scope['row']['deactivate_at'] === null || scope['row']['deleted_at'] === null"
            content="Desactivar"
            placement="top"
          >
            <el-button
              link
              type="primary"
              size="small"
              @click.prevent="deactivateRow(scope['row']['id'])"
            >
              <IconDelete />
            </el-button>
          </el-tooltip>
          <el-tooltip v-else content="Activar" placement="top">
            <el-button
              link
              type="primary"
              size="small"
              @click.prevent="restoreRow(scope['row']['id'])"
            >
              <IconRestore />
            </el-button>
          </el-tooltip>
          <el-tooltip
            v-if="scope['row']['type'] === 'movie' || scope['row']['type'] === 'tv'"
            content="Forzar extracción"
            placement="top"
          >
            <el-button
              link
              type="primary"
              size="small"
              @click.prevent="extractElem(scope['row']['id'], scope['row']['type'])"
            >
              <IconReload />
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="flex-row mt-2">
    <el-pagination
      v-if="data.length > 0"
      :page-sizes="[10, 20, 50, 100]"
      layout="prev, pager, next, sizes"
      :total="totalElements"
      :current-page="currentPage"
      :page-size="sizePage"
      class="justify-center"
      @current-change="handleChange"
      @size-change="handleSizeChange"
    />
  </div>
  <DynamicModal
    v-if="render"
    :id-reference="edit_id"
    :component-use="component_name"
    :visible="render"
    @visible="captureVisible"
    @reload="loadData"
  />
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import * as APIHandler from '@/lib/APIHandler'
import { ElMessage } from 'element-plus'
import IconEdit from '@/components/icons/IconEdit.vue'
import IconDelete from '@/components/icons/IconDelete.vue'
import IconRestore from '@/components/icons/IconRestore.vue'
import DynamicModal from '@/components/DynamicModal.vue'
import IconReload from '@/components/icons/IconReload.vue'
import type { IVisualMap } from '@/lib/types/customTypes'

const props = defineProps({
  dataType: {
    type: String,
    required: true
  }
})

const data = ref<object[]>([])
const totalElements = ref<number>(0)
const currentPage = ref<number>(1)
const sizePage = ref<number>(10)
const edit_id = ref<number>(0)
const component_name = ref<string>('')
const render = ref<boolean>(false)

const mapperData = ref<Record<string,IVisualMap>>({
  id: {
    mapped: 'ID',
    visibility: true
  },
  name: {
    mapped: 'Titulo',
    visibility: true
  },
  original_name: {
    mapped: 'Titulo Original',
    visibility: true
  },
  external_id: {
    mapped: 'ID Externo',
    visibility: true
  },
  overview: {
    mapped: 'Descripción',
    visibility: true
    //width: 500
  },
  vote_average: {
    mapped: 'Puntuación Media',
    visibility: true
  },
  vote_count: {
    mapped: 'Número de Votos',
    visibility: false
  },
  type: {
    mapped: 'Tipo',
    visibility: false
  },
  release_date: {
    mapped: 'Fecha de Lanzamiento',
    visibility: false
  },
  username: {
    mapped: 'Nombre de Usuario',
    visibility: true
  },
  email: {
    mapped: 'Correo Electrónico',
    visibility: true
  },
  created_at: {
    mapped: 'Fecha de Creación',
    visibility: false
  },
  updated_at: {
    mapped: 'Fecha de Actualización',
    visibility: false
  },
  popularity: {
    mapped: 'Popularidad',
    visibility: false
  },
  poster_path: {
    mapped: 'Poster',
    visibility: true
  },
  deactivate_at: {
    mapped: 'Fecha de Desactivación',
    visibility: false
  },
  role: {
    mapped: 'Rol',
    visibility: true
  },
  deleted_at: {
    mapped: 'Fecha de Desactivación',
    visibility: false
  }
})

const calcLabel = (key: string) => {
  return mapperData.value[key]?.mapped ? mapperData.value[key].mapped : key
}

const loadData = async () => {
  const response: { totalItems: number; items: object[]; page: number; size: number } =
    await APIHandler.get(props.dataType + `?page=${currentPage.value}&size=${sizePage.value}`)
  data.value = response?.items
}

onBeforeMount(async () => {
  const response: { totalItems: number; items: object[]; page: number; size: number } =
    await APIHandler.get(props.dataType + `?page=${currentPage.value}&size=${sizePage.value}`)
  totalElements.value = response.totalItems

  data.value = response.items
})

const handleChange = (newVal: number) => {
  currentPage.value = newVal
}

const handleSizeChange = (newVal: number) => {
  currentPage.value = 1
  sizePage.value = newVal
}

watch(
  () => currentPage.value,
  async () => {
    await loadData()
  }
)

watch(
  () => sizePage.value,
  async () => {
    await loadData()
  }
)

const formatterText = (row: any, column: any, cellValue: any, index: any) => {
  if (column.property === 'poster_path') {
    return `<img src=${cellValue} alt="poster" class="w-20 h-20"/>`
  } else if (column.property === 'type') {
    return cellValue === 'movie' ? 'Película' : 'Serie'
  } else if (
    column.property === 'created_at' ||
    column.property === 'updated_at' ||
    column.property === 'release_date' ||
    column.property === 'deactivate_at'
  ) {
    return cellValue ? new Date(cellValue).toLocaleDateString() : cellValue
  } else if (column.property === 'role') {
    return cellValue.name.charAt(0).toUpperCase() + cellValue.name.slice(1)
  } else {
    return cellValue
  }
}

const calcUrlImg = (url_path: string) => {
  return import.meta.env.VITE_IMG_CDN + 'w300/' + url_path
}

const deactivateRow = async (id: number) => {
  const splitProps = props.dataType.split('/')
  await APIHandler.get(splitProps[0] + '/deactivate/' + id)

  const response: { totalItems: number; items: object[]; page: number; size: number } =
    await APIHandler.get(props.dataType + `?page=${currentPage.value}&size=${sizePage.value}`)
  data.value = response?.items
}

const restoreRow = async (id: number) => {
  const splitProps = props.dataType.split('/')
  await APIHandler.get(splitProps[0] + '/restore/' + id)

  const response: { totalItems: number; items: object[]; page: number; size: number } =
    await APIHandler.get(props.dataType + `?page=${currentPage.value}&size=${sizePage.value}`)
  data.value = response?.items
}

const captureVisible = (visible: boolean) => {
  render.value = visible
}

const editElem = (id: string) => {
  render.value = true
  const splitProps = props.dataType.split('/')
  edit_id.value = Number(id)
  component_name.value = splitProps[0]
}

const extractElem = async (id: number, type: string) => {
  await APIHandler.get('Synchro' + type.charAt(0).toUpperCase() + type.slice(1) + '/' + id)
  ElMessage.success('Extracción realizada correctamente')
}
</script>

<style scoped>
.truncateText {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100px;
}
.header-column {
  font-weight: bold;
  text-wrap: normal;
}
.text-personal {
  word-break: break-word;
}
</style>
