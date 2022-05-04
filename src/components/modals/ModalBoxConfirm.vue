<script setup>
import { computed } from 'vue'
import JbButton from '@/components/JbButton.vue'
import CardComponent from '@/components/CardComponent.vue'
import OverlayConfirm from '@/components/modals/OverlayConfirm.vue'

const props = defineProps({
  title: {
    type: String,
    default: null
  },
  button: {
    type: String,
    default: 'white'
  },
  buttonLabel: {
    type: String,
    default: 'Done'
  },
  hasCancel: Boolean,
  modelValue: {
    type: [String, Number, Boolean],
    default: null
  },
  hasButton: Boolean
})

const emit = defineEmits(['update:modelValue', 'cancel', 'confirm'])

const value = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})

const confirmCancel = mode => {
  value.value = false
  emit(mode)
}

const confirm = () => confirmCancel('confirm')
const cancel = () => confirmCancel('cancel')

</script>

<template>
  <overlay-confirm
    v-show="value"
    @overlay-click="cancel"
  >
    <card-component
      v-show="value"
      has-table
      :title="title"
      class="shadow-xl border border-gray-300 w-50 max-h-modal md:w-4/5 lg:w-1/5 z-50 p-5 rounded-2xl"
      @header-icon-click="cancel"
      @header-icon2-click="logout"
    >
      <div class="space-y-3 items-center justify-center">
        <slot />
      </div>

      <div
        class="flex items-stretch justify-between mt-5"
      >
        <jb-button
          v-if="hasCancel"
          class="w-full mr-5"
          label="Cancel"
          :color="button"
          outline
          @click="cancel"
        />
        <jb-button
          v-if="hasButton"
          :label="buttonLabel"
          :color="button"
          class="w-full"
          @click="confirm"
        />
      </div>
    </card-component>
  </overlay-confirm>
</template>
