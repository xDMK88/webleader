<script setup>

import { reactive } from 'vue'
import { useStore } from 'vuex'
import { SEARCH_TASK } from '@/store/actions/tasks'
import Control from '@/components/Control.vue'

const store = useStore()

const form = reactive({
  text: ''
})

const sendSearchRequest = () => {
  store.dispatch(SEARCH_TASK, form.text)
}

const props = defineProps({
  placeholder: {
    type: String,
    required: true
  }
})
</script>

<template>
  <control
    ref="root"
    v-model="form.text"
    :placeholder="props.placeholder"
    borderless
    transparent
    @keyup.enter="sendSearchRequest"
  />
</template>
