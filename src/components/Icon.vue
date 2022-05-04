<script setup>
import { computed } from 'vue'

const props = defineProps({
  path: {
    type: [String, Array],
    required: true
  },
  w: {
    type: String,
    default: ''
  },
  h: {
    type: String,
    default: ''
  },
  box: {
    type: String
  },
  width: {
    type: [String, Number],
    default: 24
  },
  height: {
    type: [String, Number],
    default: 24
  }
})

const spanClass = computed(() => `inline-flex justify-center items-center ${props.w} ${props.h}`)
</script>

<template>
  <span :class="spanClass">
    <svg
      v-if="typeof path === 'string'"
      :viewBox="box"
      :width="width"
      :height="height"
      class="inline-block"
    >
      <path
        fill="currentColor"
        fill-rule="evenodd"
        clip-rule="evenodd"
        :d="path"
      />
    </svg>
    <svg
      v-if="typeof path === 'object'"
      fill="none"
      :viewBox="box"
      :width="width"
      :height="height"
      class="inline-block"
    >
      <path
        v-for="(value, index) in path"
        :key="index"
        fill-rule="evenodd"
        clip-rule="evenodd"
        fill="currentColor"
        :d="value"
      />
    </svg>
  </span>
</template>
