<template>
  <div>
  <el-card class="mb-2">
    <el-collapse>
      <el-collapse-item title="Ordenar" name="1">
        <div class="font-bold">Ordenar resultados por</div>
        <el-select v-model="sort" placeholder="ordenar por" class="w-48" @change="changeSort">
          <el-option
            v-for="item in sortOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-collapse-item>
    </el-collapse>
  </el-card>
  <el-card>
    <el-collapse>
      <el-collapse-item title="Filtros" name="1" >
        <div class="font-bold">Palabra clave</div>
        <el-input v-model="keyword" placeholder="Filtrar por palabra clave" />
        <el-divider />
<!--        <div class="font-bold">Proveedores</div>-->
        <el-collapse-item title="Proveedores" name="2">
          <el-link v-for="item in providersList" :key="item.id" @click="enableCheckProvider(item.id)" class="m-1" ><img :src="calculateProviderImage(item.logo_path)" class="rounded opacity-75" :id="'provider-tag-' + item.id" :alt="'Logo de ' + item.name"></el-link>
        </el-collapse-item>
<!--        <div class="font-bold">Géneros</div>-->
        <el-collapse-item title="Géneros" name="3">
          <el-check-tag v-for="item in genresList" :key="item.id" :checked="item.checked" class="m-1" @change="enableCheckGenres(item.id)" > {{ item.name }} </el-check-tag>
        </el-collapse-item>
<!--        <el-divider />-->
        <div class="font-bold">Fecha de estreno</div>
        <el-checkbox label="¿Búsqueda por fecha de estreno?" :checked="checkAirDate" @change="enableAirDate"/>
        <div v-if="checkAirDate">
          <el-date-picker
            v-model="fromAirDate"
            type="date"
            placeholder="Desde"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
            clearable
            class="my-2"
          />
          <el-date-picker
            v-model="toAirDate"
            type="date"
            placeholder="Hasta"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
            clearable
          />
        </div>
        <el-divider />
        <div class="font-bold">Puntuación de los usuarios </div>
        <el-slider v-model="voteAverage" range :step="1" :max="10" :marks="voteAverageMarks" class="p-4"/>
        <el-divider />
        <div class="font-bold">Votos mínimos </div>
        <el-slider v-model="voteCount" :step="50" :max="500" :marks="voteCountMarks" class="p-4"/>
        <el-divider />
        <el-button type="primary" @click="emitChanges" size="large" class="w-full">Aplicar filtros</el-button>
      </el-collapse-item>
    </el-collapse>
  </el-card>
  </div>
</template>

<script setup lang="ts">

import {type CSSProperties, onBeforeMount, reactive, ref, watch} from "vue";
import * as APIHandler from "@/lib/APIHandler";
import type { IGenre, IProvider } from '@/lib/types/customTypes'

interface Mark {
  style: CSSProperties
  label: string
}

type Marks = Record<number, Mark | string>

const emit = defineEmits(['filterChange'])

const genresList = ref<IGenre[]>([])
const providersList = ref<IProvider[]>([])
const checkAirDate = ref<boolean>(false)
const fromAirDate = ref<string | undefined>(undefined)
const toAirDate = ref<string | undefined>(undefined)
const voteAverage = ref<number[] | undefined>(undefined)
const voteCount = ref<number | undefined>(undefined)
const keyword = ref<string | undefined>(undefined)
const sort = ref<string>('popularity:desc')
const voteAverageMarks = reactive<Marks>({
  0: '0',
  2: '2',
  4: '4',
  6: '6',
  8: '8',
  10: '10'
})
const voteCountMarks = reactive<Marks>({
  0: '0',
  100: '100',
  200: '200',
  300: '300',
  400: '400',
  500: '500'
})
const sortOptions = reactive([
  { value: 'popularity:desc', label: 'Popularidad descendente' },
  { value: 'popularity:asc', label: 'Popularidad ascendente' },
  { value: 'release_date:desc', label: 'Fecha de estreno descendente' },
  { value: 'release_date:asc', label: 'Fecha de estreno ascendente' },
  { value: 'vote_average:desc', label: 'Puntuación media descendente' },
  { value: 'vote_average:asc', label: 'Puntuación media ascendente' },
  { value: 'vote_count:desc', label: 'Número de votos descendente' },
  { value: 'vote_count:asc', label: 'Número de votos ascendente' },
  { value: 'name:asc', label: 'Título ascendente' },
  { value: 'name:desc', label: 'Título descendente' }
])

onBeforeMount(async () => {
  const response = await APIHandler.get(`watchable/genre`)
  if (response) {
    genresList.value = response.map((item: IGenre) => {
      return {checked: false, ...item}
    })
  }

  const providers = await APIHandler.get(`provider`)
  if (providers) {
    providersList.value = providers.map((provider: IProvider) => {
      return {checked: false, ...provider}
    })
  }
})

const enableCheckGenres = (id: number) => {
  genresList.value = genresList.value.map(item => {
    if (item.id === id) {
      item.checked = !item.checked
    }
    return item
  })
}

const enableCheckProvider = (id: number) => {
  providersList.value = providersList.value.map(item => {
    if (item.id === id) {
      item.checked = !item.checked
    }
    if (item.checked) {
      document.getElementById('provider-tag-' + item.id)?.classList.add('border','border-blue-500')
      document.getElementById('provider-tag-' + item.id)?.classList.remove('opacity-75')
    } else {
      document.getElementById('provider-tag-' + item.id)?.classList.remove('border','border-blue-500', 'opacity-75')
      document.getElementById('provider-tag-' + item.id)?.classList.add('opacity-75')
    }
    return item
  })
}

const enableAirDate = () => {
  checkAirDate.value = !checkAirDate.value
}

const calculateAirDate = () => {
  if(fromAirDate.value && toAirDate.value)
    return {'release_date': `between:${fromAirDate.value},${toAirDate.value}`}
  else if (fromAirDate.value && !toAirDate.value)
    return {'release_date': `gte:${fromAirDate.value}`}
  else if (!fromAirDate.value && toAirDate.value)
    return {'release_date': `lte:${toAirDate.value}`}
  else
    return {'release_date': undefined}
}

const calculateProviderImage = (url: string) => {
  return import.meta.env.VITE_IMG_CDN + 'w45' + url
}

const changeSort = (newSort: string) => {
  sort.value = newSort;
}

watch(() => sort.value, (newValue) => {
  emit('filterChange', {'sort': newValue})
})

const emitChanges = () => {
  const genresIds = genresList.value.filter(item => item.checked).map(item => item.id)
  const providersIds = providersList.value.filter(item => item.checked).map(item => item.id)
  emit('filterChange', {'sort': sort.value, filter: {'keyword': keyword.value ? keyword.value?.replaceAll(' ', ',') : keyword.value, 'vote_average': 'between:' + voteAverage.value, 'vote_count': 'gte:' + voteCount.value, 'provider.id': 'in:' + providersIds, 'genres.id': 'in:' + genresIds, ...calculateAirDate() }})
}

/*watch(() => genresList.value, (newValue) => {
  const filter = newValue.filter(item => item.checked).map(item => item.id)
  if(filter.length > 0)
    emit('filterChange', {'genres.id': filter})
})

watch(() => checkAirDate.value, (newValue) => {
  if (newValue) {
    calculateAirDate()
  } else {
    toAirDate.value = undefined
    fromAirDate.value = undefined
  }
})

watch(() => fromAirDate.value, (newValue) => {
  calculateAirDate()
})

watch(() => toAirDate.value, (newValue) => {
  calculateAirDate()
})*/

</script>

<style scoped>

</style>