<script setup>
import Icon from '@/components/Icon.vue'
import { computed, ref } from 'vue'
import properties from '@/icons/properties.js'
import { useStore } from 'vuex'
import * as TASK from '@/store/actions/tasks'
import { SELECT_EMPLOYEE } from '@/store/actions/employees'
import { SELECT_DEPARTMENT } from '@/store/actions/departments'
import gridView from '@/icons/grid-view.js'
import listView from '@/icons/list-view.js'

defineProps({
  employees: {
    type: Array,
    default: () => []
  }
})

const store = useStore()

// Serves as linkage between requests from storage and tree view navigator
const UID_TO_ACTION = {
  'd28e3872-9a23-4158-aea0-246e2874da73': TASK.EMPLOYEE_TASKS_REQUEST
}

const isGridView = computed(() => store.state.isGridView)

const updateGridView = (value) => {
  store.commit('basic', { key: 'isGridView', value: value })
  localStorage.setItem('isGridView', value)
}

const isPropertiesMobileExpanded = computed(() => store.state.isPropertiesMobileExpanded)
const storeEmployees = computed(() => store.state.employees.employees)
const user = computed(() => store.state.user.user)
const focusedEmployee = ref('')

const openDepartmentProperties = (department) => {
  if (!isPropertiesMobileExpanded.value) {
    store.dispatch('asidePropertiesToggle', true)
  }
  if (!department) {
    department = {
      uid: '',
      uid_parent: '',
      name: '',
      password: '',
      order: 0,
      collapsed: 0,
      emails: ''
    }
  }
  store.commit('basic', { key: 'propertiesState', value: 'department' })
  store.commit(SELECT_DEPARTMENT, department)
}

const openEmployeeProperties = (employee) => {
  if (!isPropertiesMobileExpanded.value) {
    store.dispatch('asidePropertiesToggle', true)
  }
  focusedEmployee.value = employee.email
  if (!employee) {
    employee = {
      email: '',
      name: '',
      password: ''
    }
  }
  store.commit('basic', { key: 'propertiesState', value: 'employee' })
  store.commit(SELECT_EMPLOYEE, employee)
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
  <!-- Add employee and department -->
  <div
    class="flex items-center w-full justify-between mt-3"
  >
    <p class="text-2xl text-gray-800 font-bold second dark:text-gray-100">
      Сотрудники
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
    v-if="storeEmployees[user.current_user_uid] && (storeEmployees[user.current_user_uid].type == 1 || storeEmployees[user.current_user_uid].type == 2)"
    class="grid gap-4 mb-4 mt-3"
    :class="{ 'md:grid-cols-2 lg:grid-cols-4': isGridView, 'grid-cols-1': !isGridView, 'grid-cols-1': isPropertiesMobileExpanded && !isGridView, 'lg:grid-cols-2': isPropertiesMobileExpanded && isGridView }"
  >
    <div
      class="flex items-center bg-gray-50 dark:bg-gray-700 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-500 cursor-pointer px-3 py-3"
      @click="openEmployeeProperties(false)"
    >
      <div class="flex items-center justify-center w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-xl mr-2">
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
      <p class="text-gray-500">
        Добавить сотрудника
      </p>
    </div>

    <div
      class="flex items-center bg-gray-50 dark:bg-gray-700 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-500 cursor-pointer px-3 py-3"
      @click="openDepartmentProperties(false)"
    >
      <div class="flex items-center justify-center w-10 h-10 bg-gray-200 mr-2 dark:bg-gray-600 rounded-xl">
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
      <p class="text-gray-500">
        Добавить отдел
      </p>
    </div>
  </div>
  <div
    v-for="(value, index) in employees"
    :key="index"
  >
    <div
      class="flex items-center"
      :class="index !=0 ? 'mt-5' : ''"
    >
      <p class="text-2xl text-gray-800 font-bold dark:text-gray-100 mr-2">
        {{ value.dep.name }}
      </p>
      <icon
        v-if="value.dep.uid"
        :path="properties.path"
        :width="properties.width"
        :height="properties.height"
        :box="properties.viewBox"
        class="text-gray-400 cursor-pointer hover:text-gray-800 mt-1"
        @click="openDepartmentProperties(value.dep)"
      />
    </div>
    <div
      class="grid gap-4 mt-5"
      :class="{ 'md:grid-cols-2 lg:grid-cols-4': isGridView, 'grid-cols-1': !isGridView, 'grid-cols-1': isPropertiesMobileExpanded && !isGridView, 'lg:grid-cols-2': isPropertiesMobileExpanded && isGridView }"
    >
      <template
        v-for="(employee, pindex) in value.items"
        :key="pindex"
      >
        <div
          class="flex items-center bg-white dark:bg-gray-700 rounded-xl shadow hover:shadow-md cursor-pointer h-30 px-3 py-5"
          :class="{ 'ring-4 ring-orange-300': focusedEmployee == employee.email }"
        >
          <span
            v-if="employee.type == 1"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 28 32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 0.5C0.895431 0.5 0 1.39543 0 2.5V4.42076C0 8.08112 2.17694 11.368 5.59249 12.7873C5.78016 14.9536 6.79357 16.9332 8.44504   18.3899C9.30831 19.1369 9.87132 20.1454 10.0965 21.2286H7.43164V24.9263H5.59249V29.5204H3.71582V31.5H24.2467V29.5204H22.4075V24.9263H20.5684V21.2286H17.9035C18.1287 20.1454 18.7292 19.1369 19.555 18.3899C21.2064 16.9706 22.2198 14.9536 22.4075 12.7873C25.7855 11.368 28 8.08112 28 4.42076V2.5C28 1.39543 27.1046 0.5 26 0.5H2ZM25.9357 2.47959V4.42076C25.9357 6.9606 24.5845 9.27634 22.37 10.5463V2.47959H25.9357ZM9.42091 24.9263V23.2455H18.5416V24.9263H9.42091ZM18.2038 16.8959C16.9276 18.0164 16.0643 19.5478 15.8391 21.2286H12.1609C11.9357 19.5478 11.0724 18.0164 9.79625 16.8959C8.40751 15.7007 7.6193 13.9452 7.6193 12.115V2.47959H20.4182V12.0776C20.3807 13.9452 19.555 15.7007 18.2038 16.8959ZM7.54424 29.5204V26.9059H20.3432V29.5204H7.54424ZM5.55496 10.5836C3.37802 9.31369 1.98928 6.9606 1.98928 4.42076V2.47959H5.55496V10.5836Z"
                fill="#FF9123"
              />
            </svg>
          </span>
          <span
            v-if="employee.type == 2"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M29.0304 10.5639L20.037 9.19515L16.0167 0.660254C15.9069 0.426573 15.7262 0.237403 15.5031 0.122418C14.9434 -0.166901 14.2633 0.074198 13.9835 0.660254L9.96319 9.19515L0.969774 10.5639C0.721827 10.6009 0.495132 10.7234 0.321568 10.9088C0.11174 11.1347 -0.00388537 11.4385 9.96959e-05 11.7536C0.00408476 12.0686 0.127354 12.3691 0.342821 12.5891L6.84968 19.2323L5.3124 28.6129C5.27635 28.8311 5.29941 29.0555 5.37896 29.2607C5.45852 29.4659 5.59138 29.6436 5.76249 29.7738C5.9336 29.9039 6.13611 29.9812 6.34705 29.997C6.55799 30.0127 6.76893 29.9663 6.95594 29.8629L15.0001 25.4341L23.0442 29.8629C23.2638 29.9853 23.5188 30.0261 23.7633 29.9816C24.3796 29.8703 24.794 29.2583 24.6877 28.6129L23.1505 19.2323L29.6573 12.5891C29.8344 12.4073 29.9513 12.1699 29.9867 11.9103C30.0824 11.2612 29.6502 10.6603 29.0304 10.5639ZM20.4124 18.2976L21.6911 26.098L15.0001 22.4185L8.30903 26.1018L9.58773 18.3013L4.17538 12.7745L11.6563 11.6358L15.0001 4.54009L18.3438 11.6358L25.8248 12.7745L20.4124 18.2976Z"
                fill="#FF9123"
              />
            </svg>
          </span>
          <img
            v-if="employee.fotolink"
            :src="employee.fotolink"
            class="rounded-lg mx-2 my-auto"
            width="38"
            height="38"
          >
          <div class="w-full">
            <div class="flex items-start justify-between">
              <p
                class="font-normal cursor-pointer"
                @click="clickOnGridCard(employee)"
              >
                {{ employee.name }}
              </p>
              <icon
                :path="properties.path"
                :width="properties.width"
                :height="properties.height"
                :box="properties.viewBox"
                class="text-gray-400 cursor-pointer hover:text-gray-800"
                @click="openEmployeeProperties(employee)"
              />
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
