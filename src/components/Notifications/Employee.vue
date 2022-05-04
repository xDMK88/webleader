<script setup>
const props = defineProps({
  fotolink: {
    type: String
  },
  name: {
    type: String
  }
})
</script>
<template>
  <div class="flex items-center">
    <img :src="props.fotolink" width="35" height="35" class="rounded-xl mr-2">
    <p>{{ props.name }}</p>
  </div>
</template>
