<script setup>
import { useStore } from 'vuex'
import * as TASK from '@/store/actions/tasks'
defineProps({
  assignments: {
    type: Array,
    default: () => []
  }
})
const store = useStore()
// Serves as linkage between requests from storage and tree view navigator
const UID_TO_ACTION = {
  '169d728b-b88b-462d-bd8e-3ac76806605b': TASK.DELEGATED_TASKS_REQUEST,
  '511d871c-c5e9-43f0-8b4c-e8c447e1a823': TASK.DELEGATED_TO_USER_TASKS_REQUEST
}
const clickOnGridCard = (value) => {
  store.dispatch(UID_TO_ACTION[value.parentID], value.email)
  const navElem = {
    name: value.name,
    key: 'taskListSource',
    value: { uid: value.parentID, param: value.email }
  }
  store.commit('pushIntoNavStack', navElem)
  store.commit('basic', { key: 'taskListSource', value: { uid: value.parentID, param: value.email } })
  store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
  store.commit(TASK.CLEAN_UP_LOADED_TASKS)
}
</script>

<template class="w-full">
  <div
    v-for="(value, index) in assignments"
    :key="index"
  >
    <p
      class="text-2xl text-gray-800 font-bold dark:text-gray-100"
      :class="index != 0 ? 'mt-5' : '0'"
    >
      {{ value.dep }}
    </p>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
      <template
        v-for="(employee, pindex) in value.items"
        :key="pindex"
      >
        <div
          class="flex items-center bg-white dark:bg-gray-700 rounded-xl shadow hover:shadow-md cursor-pointer h-30 px-3 py-5"
        >
          <img
            v-if="employee.fotolink"
            :src="employee.fotolink"
            class="rounded-lg mx-2 my-auto"
            width="38"
            height="38"
          >
          <div class="w-full">
            <div class="flex items-start justify-left">
              <p
                class="font-normal cursor-pointer"
                @click="clickOnGridCard(employee)"
              >
                {{ employee.name }}
              </p>
            </div>
            <p class="font-light text-xs break-all">
              {{ employee.email }}
            </p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
