<template>
  <div class="rounded w-fit reduced-bg">
    <h1 class="flex justify-center py-2">¿ Donde ver ?</h1>
    <el-row>
      <div class="flex justify-center px-2 w-80">
        <span v-if="providers.length == 0" class="pb-3">No hay proveedores disponibles</span>
        <img v-else v-for="item in providers" :src="calculateProviderImage(item.logo_path)" class="p-1.5 pb-3 rounded-lg" :id="'provider-tag-' + item.id" :alt="'Logo de ' + item.name">

      </div>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import {onBeforeMount, ref} from "vue";
import * as APIHandler from "@/lib/APIHandler";
import type {IProvider} from "@/lib/types/customTypes";

const props = defineProps({
  watchable_id: {
    type: Number,
    required: true
  }
})

const providers = ref<IProvider[]>([])

onBeforeMount(async () => {
  const response = await APIHandler.get(`provider/watchable/${props.watchable_id}`)
  if (response) {
    providers.value = response
  }
})

const calculateProviderImage = (url: string) => {
  return import.meta.env.VITE_IMG_CDN + 'w45' + url
}
</script>

<style scoped>
.reduced-bg {
  background-color: rgb(17 24 39 / 0.90);
  position: relative;
}

</style>