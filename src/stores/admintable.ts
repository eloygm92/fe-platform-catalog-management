import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdminTableStore = defineStore(
  'adminTable',
  () => {
    const dataTypes = ref<string>(undefined)
    const indexType = ref<string>(undefined)

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
