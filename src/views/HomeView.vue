<template>
  <header v-loading="watchableList.length === 0" class="bg-white">
    <div class="md:flex space-x-16 mt-20 md:mr-0 mr-10">
      <div class="md:flex items-center pl-16 ">
        <div class="">
          <h1 class="lg:text-5xl  font-bold leading-tight text-3xl">TrueWatch</h1>
            <p class="mt-4 text-lg font-normal ">Hazte con el control del catalogo completo de los proveedores a los que te encuentras suscrito.<br> Millones de películas y series a tu alcance. Explora ya.</p>
        </div>
      </div>
      <!-- Box right -->
      <div class="max-w-lg pr-14 md:flex justify-center items-center  hidden">
        <img class="rounded-lg" src="@/assets/series.png" alt="">
      </div>
    </div>

    <!--Show Brand -->
    <div class="hidden lg:block">
      <h3 class="text-2xl font-semibold mt-28">Lo más popular hoy</h3>
      <ul class="flex mt-6 space-x-16 justify-center">
        <WatchableGrid v-for="watchableData in watchableList" :watchable="watchableData" />
      </ul>
    </div>
  </header>
</template>

<script setup lang="ts">
import {onBeforeMount, ref} from 'vue'
import type {IWatchable} from "@/lib/types/customTypes";
import * as APIHandler from "@/lib/APIHandler";
import WatchableGrid from "@/components/WatchableGrid.vue";

const watchableList = ref<IWatchable[]>([])

onBeforeMount(async () => {
  const response = await APIHandler.get('watchable?size=6&sort=popularity:desc&page=1')
  if (response) {
    watchableList.value = response.items
  }
})
</script>
