<template>
  <el-card>
    <el-collapse>
      <el-collapse-item title="Filtros" name="1" >
        <div class="font-bold">Géneros</div>
        <el-check-tag v-for="item in genresList" :key="item.id" :checked="item.checked" class="m-1" @change="enableCheck(item.id)" > {{ item.name }} </el-check-tag>
        <el-divider />
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
        <el-slider v-model="voteAverage" range :step="1" :max="10" :marks="voteAverageMarks"/>
        <el-divider />
        <div class="font-bold">Votos mínimos </div>
        <el-slider v-model="voteCount" :step="50" :max="500" :marks="voteCountMarks"/>
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>

<script setup lang="ts">

import {type CSSProperties, onBeforeMount, reactive, ref, watch} from "vue";
import * as APIHandler from "@/lib/APIHandler";

interface Mark {
  style: CSSProperties
  label: string
}

type Marks = Record<number, Mark | string>

const emit = defineEmits(['filterChange'])

const genresList = ref<object[]>([])
const checkAirDate = ref<boolean>(false)
const fromAirDate = ref<string | undefined>(undefined)
const toAirDate = ref<string | undefined>(undefined)
const voteAverage = ref<number[]>([0, 10]) // TODO: between
const voteCount = ref<number[]>([0, 10]) // TODO: gtl
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

onBeforeMount(async () => {
  const response = await APIHandler.get(`watchable/genre`)
  if (response) {
    genresList.value = response.map(item => {
      return {checked: false, ...item}
    })
  }
})

const enableCheck = (id: number) => {
  genresList.value = genresList.value.map(item => {
    if (item.id === id) {
      item.checked = !item.checked
    }
    return item
  })
}

const enableAirDate = () => {
  checkAirDate.value = !checkAirDate.value
}

const calculateAirDate = () => {
  if(fromAirDate.value && toAirDate.value)
    emit('filterChange', {'release_date': `between:${fromAirDate.value},${toAirDate.value}`})
  else if (fromAirDate.value && !toAirDate.value)
    emit('filterChange', {'release_date': `gte:${fromAirDate.value}`})
  else if (!fromAirDate.value && toAirDate.value)
    emit('filterChange', {'release_date': `lte:${toAirDate.value}`})
  else
    emit('filterChange', {'release_date': undefined})
}

watch(() => genresList.value, (newValue) => {
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
})

</script>

<style scoped>

</style>