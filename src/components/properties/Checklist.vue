<script setup>
import contenteditable from 'vue-contenteditable'
import { useStore } from 'vuex'
import Icon from '@/components/Icon.vue'
import { computed, reactive, ref, watch, nextTick, onMounted } from 'vue'
import close from '@/icons/close.js'

const props = defineProps({
  taskUid: {
    type: String,
    default: ''
  },
  checklist: {
    type: String,
    default: ''
  }
})

const store = useStore()

const user = computed(() => store.state.user.user)
const processedChecklist = ref('')

const computedChecklist = computed(() => {
  const _renderedChecklist = []

  if (!props.checklist) {
    _renderedChecklist.push({ checked: false, text: '' })
    return _renderedChecklist
  }

  for (const check of props.checklist.split('\r\n\r\n')) {
    _renderedChecklist.push({ checked: !!+check.split('\r\n')[0], text: check.split('\r\n')[1] })
  }
  return _renderedChecklist
})

const renderedChecklist = reactive({ checklist: computedChecklist.value })
const shouldUpdate = ref(false)
watch(() => props.taskUid, (oldValue, newValue) => {
  if (oldValue !== newValue) shouldUpdate.value = true
})

watch(() => computedChecklist.value, (oldValue, newValue) => {
  if (shouldUpdate.value) {
    renderedChecklist.checklist = oldValue
    shouldUpdate.value = false
  }
})

const processChecklist = () => {
  processedChecklist.value = ''
  for (const [i, check] of renderedChecklist.checklist.entries()) {
    if (!check.text) continue
    processedChecklist.value += (check.checked ? '1' : '0') + '\r\n' + check.text
    if (i !== renderedChecklist.checklist.length - 1) {
      processedChecklist.value += '\r\n\r\n'
    }
  }
  store.state.tasks.newtasks[props.taskUid].info.cheklist = processedChecklist.value
  store.dispatch('CHANGE_TASK_CHECKLIST', { uid_task: props.taskUid, checklist: processedChecklist.value })
}

const addEmptyChecklist = (index = -1) => {
  if (!index && index !== 0) {
    renderedChecklist.checklist.push({ checked: false, text: '' })
    nextTick(() => {
      document.getElementById('check_' + (renderedChecklist.checklist.length - 1)).focus()
    })
  } else {
    renderedChecklist.checklist.splice(index + 1, 0, { checked: false, text: '' })
    nextTick(() => {
      document.getElementById('check_' + (index + 1)).focus()
    })
  }
}

const removeChecklistItem = (index) => {
  renderedChecklist.checklist.splice(index, 1)
  processChecklist()
}

const saveChecklist = (index) => {
  if (renderedChecklist.checklist.length === 1) {
    return false
  }
  if (!renderedChecklist.checklist[index].text.replace(/\r?\n|\r/g, '')) {
    renderedChecklist.checklist.splice(index, 1)
    return
  }
  renderedChecklist.checklist[index].text = renderedChecklist.checklist[index].text.replace(/\r?\n|\r/g, '')
  processChecklist()
}

const updateChecklist = (index) => {
  if (!renderedChecklist.checklist[renderedChecklist.checklist.length - 1].text) {
    return false
  }
  if (!renderedChecklist.checklist[index].text.replace(/\r?\n|\r/g, '')) {
    if (renderedChecklist.checklist.length === 1) {
      return false
    }
    renderedChecklist.checklist.splice(index, 1)
  } else {
    renderedChecklist.checklist[index].text = renderedChecklist.checklist[index].text.replace(/\r?\n|\r/g, '')
    processChecklist()
    addEmptyChecklist(index)
  }
}

onMounted(() => {
  document.getElementById('check_0').focus()
})

</script>

<template>
  <div>
    <div
      v-for="check, index of renderedChecklist.checklist"
      :key="index"
    >
      <div
        class="flex items-start group"
      >
        <div style="min-width: 10px;">
          <input
            v-model="check.checked"
            type="checkbox"
            class="m-1"
            @change="saveChecklist(index)"
          >
        </div>
        <contenteditable
          :id="'check_' + index"
          v-model="check.text"
          tag="div"
          style="max-width: 80%;"
          placeholder="write checklist here..."
          class="focus:ring focus:ring-blue-300"
          :class="{ 'text-gray-500 line-through': check.checked }"
          :contenteditable="store.state.tasks.newtasks[props.taskUid].info.uid_customer === user.current_user_uid"
          :no-n-l="true"
          :no-h-t-m-l="true"
          @keyup.enter="updateChecklist(index)"
          @blur="saveChecklist(index)"
        />
        <Icon
          v-if="store.state.tasks.newtasks[props.taskUid].info.uid_customer === user.current_user_uid"
          :path="close.path"
          class="invisible group-hover:visible px-2 py-1.5 text-gray-400 dark:text-white float-right mt-0.5 cursor-pointer"
          :box="close.viewBox"
          :width="8"
          :height="8"
          @click="removeChecklistItem(index)"
        />
      </div>
    </div>
    <button
      v-if="store.state.tasks.newtasks[props.taskUid].info.uid_customer === user.current_user_uid"
      class="mt-2 text-sm border border-gray-500 p-1 px-2 rounded-lg"
      @click="addEmptyChecklist(false)"
    >
      Добавить
    </button>
  </div>
</template>

<style>
[contenteditable=true]:empty:before{
  content: attr(placeholder);
  pointer-events: none;
  display: block; /* For Firefox */
  color: gray
}
</style>
