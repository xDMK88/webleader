<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const isFullScreen = computed(() => store.state.isFullScreen)
</script>

<template>
  <section
    class="px-0 md:px-3"
    :class="[ isFullScreen ? 'flex h-screen items-center justify-center' : 'py-2' ]"
  >
    <slot />
  </section>
</template>
