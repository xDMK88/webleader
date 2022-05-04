<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const props = defineProps({
  message: {
    type: String
  },
  date: {
    type: String
  }
})
const user = computed(() => store.state.user.user)

const getMessageTimeString = (dateCreate) => {
  const date = new Date(dateCreate)
  return date.toLocaleString('default', {
    hour: 'numeric',
    minute: 'numeric'
  })
}
</script>
<template>
  <Transition>
  <div class="flex items-start justify-end mt-4">
    <div
      class="bg-green-50 rounded-xl p-1 px-2 max-w-sm"
    >
      {{ props.message }}
      <br>
      <span class="text-sm text-gray-500">
        {{ getMessageTimeString(props.date) }}
      </span>
    </div>
    <img
      :src="user.foto_link"
      width="50"
      height="50"
      class="rounded-full mr-1"
    >
  </div>
  </Transition>
</template>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
