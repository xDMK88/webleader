<script setup>
import Icon from '@/components/Icon.vue'
import color from '@/icons/color.js'
import ready from '@/icons/ready.js'

const props = defineProps({
  label: {
    type: String
  },
  modelValue: {
    type: String
  },
  icon: {
    type: Object,
    default: color
  },
  disabled: {
    type: Boolean,
    default: false
  },
  update: {
    type: Function
  }
})

const emit = defineEmits(['update:modelValue'])

const updateValue = (value) => {
  if (!props.disabled) {
    emit('update:modelValue', value)
    props.update()
  }
}

const colors = [
  '#7FC870',
  '#017BFF',
  '#F5C900',
  '#F96300',
  '#39C0C7',
  '#FF9381',
  '#CEAD7B',
  '#6C48FF',
  '#979EA6',
  '#7D4723',
  '#E81616',
  '#C6C6DD',
  '#EBF1DB',
  '#FFDC27',
  '#FF6B18',
  '#322F35'
]

</script>
<template>
  <div class="flex items-center">
    <Icon
      :path="props.icon.path"
      :box="props.icon.viewBox"
      :width="props.icon.width"
      :height="props.icon.height"
      class="mr-2 text-gray-500"
    />
    <p>
      {{ props.label }}
    </p>
  </div>
  <div class="grid grid-cols-8 gap-1 mt-2">
    <div
      v-for="color in colors"
      :key="color"
      :style="{ 'background-color': color }"
      style="width: 39px; height: 39px;"
      class="flex items-center justify-center rounded-xl"
      :class="{ 'border-2 border-black': color == modelValue, 'hover:border-2 hover:border-black cursor-pointer': !disabled }"
      @click="updateValue(color)"
    >
      <Icon
        v-if="color == modelValue"
        :path="ready.path"
        :box="ready.viewBox"
        width="15"
        height="15"
      />
    </div>
  </div>
</template>
