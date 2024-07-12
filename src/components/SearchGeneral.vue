<template>
  <el-menu-item :index="String(index)" :class="'white_background ' + sizeClass" @keydown.space.prevent @keyup.space.prevent>
    <el-select v-model="selectValue" filterable remote placeholder=" " :remote-method="doDelayedSearch" @change="handleSelect" @focus="handleClick" @blur="handleClick" class="search_general" @keydown.space.prevent @keyup.space.prevent >
      <template #prefix>
        <IconSearch />
      </template>
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label + ' (' + item.year + ')'"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </el-menu-item>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import IconSearch from "@/components/icons/IconSearch.vue";
import * as APIHandler from "@/lib/APIHandler";
import { useRouter } from "vue-router";

const props = defineProps({
  index: {
    type: Number,
    required: true
  },
})

const router = useRouter()
const selectValue = ref<string>('')
const options = ref<{value: string, label: string, year: string}[]>([])
const timeout = ref<number | null>(null)
const sizeClass = ref<string>('w-2')

const handleRemote = async (query: string) => {
  const response = await APIHandler.get(`watchable/select/${query}`)
  if (response) {
    options.value = response.map((item: any) => {
      const year = item.release_date ? new Date(item.release_date).getFullYear() : ''
      return {
        value: item.id,
        label: item.name,
        year: year
      }
    })

  }
}

const handleSelect = (value: string) => {
  if (value && value != '') {
    router.push(`/watchable/${value}`)
    options.value = []
    selectValue.value = ''
  }
}

const handleClick = (event: FocusEvent) => {
  if (event.type === 'focus')
    sizeClass.value = 'w-fit'
  else
    sizeClass.value = 'w-2'
}

const doDelayedSearch = async (value: string) => {
  if (timeout.value) {
    clearTimeout(timeout.value)
  }
  timeout.value = setTimeout(async () => {
    if(value) {
      await handleRemote(value)
    }
  }, 500)
}
</script>

<style>
.search_general > div > div > div.el-input__wrapper {
  box-shadow: none !important;
}

.el-select .el-input.is-focus .el-input__wrapper {
  box-shadow: 0 3px 0 -2px var(--el-select-input-focus-border-color) !important;
}

.el-select .el-input__wrapper.is-focus {
  box-shadow: 0 3px 0 -2px var(--el-select-input-focus-border-color) !important;
}

.white_background {
  background-color: white !important;
}
.white_background:focus {
  border: none !important;
}

</style>