<script setup>

import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const settings = computed(() => store.state.navigator.navigator.settings)

</script>

<template>
  <div
    v-for="(key, value) in settings"
    :key="key"
  >
    {{ value }} {{ key }}
  </div>
</template>
