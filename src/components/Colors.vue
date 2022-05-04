<script setup>
import Icon from '@/components/Icon.vue'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import * as TASK from '@/store/actions/tasks'
import { SELECT_COLOR } from '@/store/actions/colors'
import properties from '@/icons/properties.js'
import gridView from '@/icons/grid-view.js'
import listView from '@/icons/list-view.js'

defineProps({
  colors: {
    type: Array,
    default: () => []
  }
})
const store = useStore()
// Serves as linkage between requests from storage and tree view navigator
const UID_TO_ACTION = {
  'ed8039ae-f3de-4369-8f32-829d401056e9': TASK.COLOR_TASKS_REQUEST
}
const isPropertiesMobileExpanded = computed(() => store.state.isPropertiesMobileExpanded)

const isGridView = computed(() => store.state.isGridView)
const focusedColor = ref('')

const updateGridView = (value) => {
  store.commit('basic', { key: 'isGridView', value: value })
  localStorage.setItem('isGridView', value)
}

const openProperties = (color) => {
  if (!isPropertiesMobileExpanded.value) {
    store.dispatch('asidePropertiesToggle', true)
  }
  focusedColor.value = color.uid
  store.commit('basic', { key: 'propertiesState', value: 'color' })
  if (!color) {
    color = {
      back_color: '',
      fore_color: '',
      uppercase: 0,
      order: 0,
      default: 0,
      uid: '',
      name: '',
      bold: 0
    }
  }
  store.commit(SELECT_COLOR, color)
}
const clickOnGridCard = (value) => {
  if (UID_TO_ACTION[value.parentID]) {
    store.dispatch(UID_TO_ACTION[value.parentID], value.uid)
    const navElem = {
      name: value.name,
      key: 'taskListSource',
      value: { uid: value.parentID, param: value.uid }
    }
    store.commit('pushIntoNavStack', navElem)
    store.commit('basic', { key: 'taskListSource', value: { uid: value.parentID, param: value.uid } })
  }
  store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
  store.commit(TASK.CLEAN_UP_LOADED_TASKS)
}
</script>

<template class="w-full">
  <div
    class="flex items-center w-full justify-between mt-3 order-1"
  >
    <p class="text-2xl text-gray-800 font-bold second dark:text-gray-100">
      Цвета
    </p>
    <div
      class="flex"
    >
      <icon
        :path="listView.path"
        :width="listView.width"
        :height="listView.height"
        :box="listView.viewBox"
        class="cursor-pointer hover:text-gray-800 mr-2 mt-0.5"
        :class="{ 'text-gray-800': !isGridView, 'text-gray-400': isGridView }"
        @click="updateGridView(false)"
      />
      <icon
        :path="gridView.path"
        :width="gridView.width"
        :height="gridView.height"
        :box="gridView.viewBox"
        class="cursor-pointer hover:text-gray-800 mr-2 mt-0.5"
        :class="{ 'text-gray-800': isGridView, 'text-gray-400': !isGridView }"
        @click="updateGridView(true)"
      />
    </div>
  </div>
  <div
    class="grid gap-4 mt-3 order-2"
    :class="{ 'md:grid-cols-2 lg:grid-cols-4': isGridView, 'grid-cols-1': !isGridView, 'grid-cols-1': isPropertiesMobileExpanded && !isGridView, 'lg:grid-cols-2': isPropertiesMobileExpanded && isGridView }"
  >
    <template
      v-for="(color, pindex) in colors"
      :key="pindex"
    >
      <div
        class="flex items-center bg-white dark:bg-gray-700 rounded-xl shadow hover:shadow-md cursor-pointer h-30 px-3 py-5 order-4"
        :class="{ 'ring-4 ring-orange-300': focusedColor == color.uid }"
      >
        <div class="w-full">
          <div class="flex items-center justify-between">
            <div
              class="flex items-start"
            >
              <div
                class="rounded-xl mr-2 mt-0.5"
                style="min-width: 38px; min-height: 38px;"
                :style="{ backgroundColor: color.back_color }"
              />
              <p
                class="font-normal cursor-pointer self-center"
                :class="{ 'uppercase': color.uppercase }"
                @click="clickOnGridCard(color)"
              >
                {{ color.name }}
              </p>
            </div>
            <icon
              :path="properties.path"
              :width="properties.width"
              :height="properties.height"
              :box="properties.viewBox"
              class="text-gray-400 cursor-pointer hover:text-gray-800"
              @click="openProperties(color)"
            />
          </div>
        </div>
      </div>
    </template>
    <div
      class="flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-500 cursor-pointer px-5 py-7 order-3"
      @click="openProperties(false)"
    >
      <div class="flex items-center justify-center w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-xl">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="dark:text-gray-100"
        >
          <path
            d="M8.00011 2.3457V8.4034M8.00011 8.4034V14.4611M8.00011 8.4034H14.4617M8.00011 8.4034H1.53857"
            stroke="#3E3D3B"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
      </div>
    </div>
  </div>
</template>
