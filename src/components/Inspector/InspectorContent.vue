<script setup>
import { watch, ref, nextTick } from 'vue'
import InspectorMessage from '@/components/Inspector/InspectorMessage.vue'
import CustomerMessage from '@/components/Inspector/CustomerMessage.vue'

const chat = ref(null)

const props = defineProps({
  messages: {
    type: Array
  },
  selectEmployee: {
    type: Function
  },
  selectProject: {
    type: Function
  },
  selectTag: {
    type: Function
  },
  selectColor: {
    type: Function
  },
  selectAccess: {
    type: Function
  },
  selectTime: {
    type: Function
  },
  actionConfirmNewParams: {
    type: Function
  },
  actionConfirmDelegate: {
    type: Function
  },
  lastSelected: {
    type: Function
  }
})

watch(props.messages, (oldValue, newValue) => {
  nextTick(() => {
    chat.value.scrollTo(0, chat.value.scrollHeight)
  })
})

</script>
<template>
  <div
    ref="chat"
    class="pb-5"
  >
    <div
      v-for="message of props.messages"
      :key="message"
    >
      <InspectorMessage
        v-if="message.messageFromInspector"
        :message="message.message"
        :type="message.type"
        :date="message.createDate"
        :select-employee="props.selectEmployee"
        :select-project="props.selectProject"
        :select-tag="props.selectTag"
        :select-color="props.selectColor"
        :select-access="props.selectAccess"
        :select-time="props.selectTime"
        :action-confirm-new-params="props.actionConfirmNewParams"
        :action-confirm-delegate="props.actionConfirmDelegate"
        :last-selected="props.lastSelected"
      />
      <CustomerMessage
        v-else
        :message="message.message"
        :type="message.type"
        :date="message.createDate"
      />
    </div>
  </div>
</template>
