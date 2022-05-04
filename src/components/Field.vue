<script setup>
import { computed, useSlots } from 'vue'

defineProps({
  label: {
    type: String,
    default: null
  },
  help: {
    type: String,
    default: null
  },
  maxCount: {
    type: Number,
    default: 0
  },
  actualCount: {
    type: Number,
    default: 0
  }
})

const slots = useSlots()

const wrapperClass = computed(() => {
  const base = []
  const slotsLength = slots.default().length

  if (slotsLength > 1) {
    base.push('grid grid-cols-1 gap-3')
  }

  if (slotsLength === 2) {
    base.push('md:grid-cols-2')
  }

  return base
})
</script>

<template>
  <div class="mb-3 last:mb-0">
    <label
      v-if="label"
      class="block font-bold mb-2"
    >{{ label }}</label>
    <div :class="wrapperClass">
      <slot />
    </div>
    <div
      v-if="help"
      class="text-xs text-gray-400 dark:text-gray-400 mt-1"
    >
      {{ help }}
    </div>
    <div
      v-if="maxCount"
      class="flex justify-between mt-1"
    >
      <div
        v-for="n in maxCount"
        :key="n"
        class="border w-full mx-0.5 border-gray-300 rounded-full"
        :class="{ 'border-lime-500': (actualCount+1) > n }"
      />
    </div>
  </div>
</template>
