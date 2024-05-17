import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMaintenanceStore = defineStore(
  'maintenance',
  () => {
    const maintenance = ref<boolean>(false)

    function setMaintenance(newMaintenance: boolean) {
      maintenance.value = newMaintenance
    }

    return { maintenance, setMaintenance }
  },
  { persist: true }
)