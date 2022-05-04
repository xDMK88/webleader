<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

import ModalBoxConfirm from '@/components/modals/ModalBoxConfirm.vue'

import { CREATE_DEPARTMENT_REQUEST, UPDATE_DEPARTMENT_REQUEST, REMOVE_DEPARTMENT_REQUEST, PUSH_DEPARTMENT } from '@/store/actions/departments'
// import { NAVIGATOR_PUSH_EMPLOYEE, NAVIGATOR_REMOVE_EMPLOYEE } from '@/store/actions/navigator'

const store = useStore()
const selectedDepartment = computed(() => store.state.departments.selectedDepartment)
const user = computed(() => store.state.user.user)
const employees = computed(() => store.state.employees.employees)
const showConfirm = ref(false)

function uuidv4 () {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

const createOrUpdateDepartment = (department) => {
  if (!department.uid) {
    department.uid = uuidv4()
    store.dispatch(CREATE_DEPARTMENT_REQUEST, department)
      .then(resp => {
        console.log(resp)
        store.dispatch('asidePropertiesToggle', false)
        store.commit(PUSH_DEPARTMENT, [department])
        console.log(selectedDepartment.value)
        selectedDepartment.value = resp.data.name
        // store.commit(NAVIGATOR_PUSH_EMPLOYEE, [employee])
      })
  } else {
    store.dispatch(UPDATE_DEPARTMENT_REQUEST, department)
      .then(resp => {
        store.dispatch('asidePropertiesToggle', false)
      })
  }
}

const removeDepartment = (department) => {
  store.dispatch(REMOVE_DEPARTMENT_REQUEST, department.uid)
    .then(() => {
      store.dispatch('asidePropertiesToggle', false)
      // store.commit(NAVIGATOR_REMOVE_EMPLOYEE, employee)
    })
}
</script>

<template>
  <modal-box-confirm
    v-model="showConfirm"
    button="warning"
    has-button
    has-cancel
    button-label="Delete"
    @confirm="removeDepartment(selectedDepartment)"
  >
    <p class="text-center">
      Do you really wanna delete "<strong>{{ selectedDepartment.name }}</strong>" departemnt?
    </p>
  </modal-box-confirm>
  <div>
    {{selectedDepartment}}
    <div>
      <p class="text-sm text-gray-500 dark:text-gray-200">
        Свойства отдела
      </p>
      <img
        v-if="selectedDepartment.uid"
        class="mx-auto rounded-full mt-8"
        :src="selectedDepartment.fotolink"
      >
      <p
        class="mt-4"
      >
        Имя
      </p>
      <input
        v-model="selectedDepartment.name"
        type="text"
        placeholder="Имя отдела"
        class="mt-2 p-3 rounded-xl bg-gray-100 font-bold text-gray-700 w-full border-none ring-0 outline-none"
      >
      <button
        v-if="employees[user.current_user_uid].type != 3"
        class="w-full bg-gray-100 rounded-xl mt-8 p-3 text-gray-700 font-bold hover:bg-gray-200"
        @click="createOrUpdateDepartment(selectedDepartment)"
      >
        {{ selectedDepartment.uid ? 'Сохранить' : 'Создать' }}
      </button>
      <button
        v-if="selectedDepartment.uid && employees[user.current_user_uid].type != 3 && selectedDepartment.type != 1"
        class="w-full bg-red-600 rounded-xl mt-4 p-3 text-white font-bold hover:bg-red-800"
        @click="showConfirm = true"
      >
        Удалить
      </button>
    </div>
  </div>
</template>
