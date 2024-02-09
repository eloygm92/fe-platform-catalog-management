import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdminTableStore = defineStore(
  'adminTable',
  () => {
    const dataTypes = ref<string>('')
    const indexType = ref<string>('')

    function setDataTypes(newDataTypes: string) {
      dataTypes.value = newDataTypes
    }

    function setIndexType(newIndexType: string) {
      indexType.value = newIndexType
    }

    return { dataTypes, setDataTypes, setIndexType, indexType }
  },
  { persist: true }
)
