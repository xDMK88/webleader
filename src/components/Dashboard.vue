<script setup>
import Icon from '@/components/Icon.vue'
// import focus from '@/icons/focus.js'
import * as TASK from '@/store/actions/tasks.js'
import * as USER from '@/store/actions/user.js'
import unread from '@/icons/dashboardicons/unread.js'
import project from '@/icons/projectDesktop.js'
// import gear from '@/icons/dashboardicons/gear.js'
import today from '@/icons/calendar.js'
import open from '@/icons/clock.js'
import focus from '@/icons/dashboardicons/focus.js'
import inwork from '@/icons/dashboardicons/inwork.js'
import overdue from '@/icons/dashboardicons/overdue.js'
import unsorted from '@/icons/dashboardicons/unsorted.js'
import ready from '@/icons/dashboardicons/ready.js'
import Taskhead from '@/components/DashboardComponents/Taskhead.vue'
import TaskStatus from '@/components/TasksList/TaskStatus'
import performerRead from '@/icons/performer-read.js'
import performerNotRead from '@/icons/performer-not-read.js'
import { computed, reactive, onBeforeMount } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const testObj = reactive({
  today: '',
  unread: '',
  inWork: '',
  inFocus: '',
  overdue: '',
  unsorted: '',
  ready: '',
  open: ''
})

const user = {
  userData: ''
}

onBeforeMount(() => {
  store.dispatch(TASK.TASKS_REQUEST, new Date()).then(() => {
    testObj.today = store.state.tasks.today.tasks
  })
  store.dispatch(TASK.UNREAD_TASKS_REQUEST).then(() => {
    testObj.unread = store.state.tasks.unread.tasks
  })
  store.dispatch(TASK.IN_WORK_TASKS_REQUEST).then(() => {
    testObj.inWork = store.state.tasks.inWork.tasks
  })
  store.dispatch(TASK.IN_FOCUS_TASKS_REQUEST).then(() => {
    testObj.inFocus = store.state.tasks.inFocus.tasks
  })
  store.dispatch(TASK.OVERDUE_TASKS_REQUEST).then(() => {
    testObj.overdue = store.state.tasks.overdue.tasks
  })
  store.dispatch(TASK.UNSORTED_TASKS_REQUEST).then(() => {
    testObj.unsorted = store.state.tasks.unsorted.tasks
  })
  store.dispatch(TASK.READY_FOR_COMPLITION_TASKS_REQUEST).then(() => {
    testObj.ready = store.state.tasks.ready.tasks
  })
  store.dispatch(TASK.OPENED_TASKS_REQUEST).then(() => {
    testObj.open = store.state.tasks.open.tasks
  })
  store.dispatch(USER.USER_REQUEST).then(() => {
    user.userData = store.state.user.user
  })
})

// onBeforeUpdate(() => {
//   if (testObj.open.length) { // проверяем объект на заполненность
//     for (const i in testObj.open) { // пробегаемся по индексам
//       if (!testObj.overdue.includes(testObj.open[i]) && !testObj.today.includes(testObj.open[i])) { // проверяем наличие объекта из open в других объектах
//         if (testObj.open[i].customer_date_end !== testObj.open[i].customer_date_begin) { // сверяем даты, если даты одинаковы, то задание бессрочное
//           if (new Date(testObj.open[i].customer_date_end) > new Date()) { // если дата окончания позже, чем сегодняшняя дата, то задача попадает в "сегодня"
//             testObj.today.push(testObj.open[i])
//           } else { // иначе задача отправляется в просроченные
//             testObj.overdue.push(testObj.open[i])
//           }
//         }
//       }
//     }
//   }
// })

const tags = reactive(computed(() => {
  return store.state.tasks.tags
}))

const employees = reactive(computed(() => {
  return store.state.employees.employees
}))

const projects = reactive(computed(() => {
  return store.state.projects.projects
}))

const colors = reactive(computed(() => {
  return store.state.colors.colors
}))

const icons = {
  today,
  unread,
  inwork,
  unsorted,
  overdue,
  focus,
  ready,
  open
}

// const cardMenu = reactive({
//   visible: false
// })

// for (const elem in checkboxes) {
//   if (checkboxes[elem] === 'flex') {
//     document.getElementById(elem + 'checkbox').checked = true
//   } else {
//     document.getElementById(elem + 'checkbox').checked = false
//   }
//   console.log(document.getElementById(elem + 'checkbox'))
// }

// const activeCheckbox = reactive({
//   today: '',
//   unread: '',
//   inWork: '',
//   inFocus: '',
//   overdue: '',
//   unsorted: '',
//   ready: '',
//   open: ''
// })

// function hide (cardId) {
//   if (document.getElementById(cardId).style.display === 'flex') {
//     document.getElementById(cardId).style.display = 'none'
//   } else {
//     document.getElementById(cardId).style.display = 'flex'
//   }
//   console.log(activeCheckbox[cardId])
//   activeCheckbox[cardId] = document.getElementById(cardId).style.display
//   console.log(activeCheckbox[cardId])
//   console.log(document.getElementById(cardId).style.display)
//   localStorage.setItem('activeCheckbox', JSON.stringify(activeCheckbox))
// }

// const checkboxes = computed(() => {
//   return JSON.parse(localStorage.getItem('activeCheckbox'))
// })
// console.log(localStorage)

const iconsKeys = Object.keys(icons)

// link logic
const UID_TO_ACTION = {
  '901841d9-0016-491d-ad66-8ee42d2b496b': TASK.TASKS_REQUEST,
  '46418722-a720-4c9e-b255-16db4e590c34': TASK.OVERDUE_TASKS_REQUEST,
  '017a3e8c-79ac-452c-abb7-6652deecbd1c': TASK.OPENED_TASKS_REQUEST,
  '5183b619-3968-4c3a-8d87-3190cfaab014': TASK.UNSORTED_TASKS_REQUEST,
  'fa042915-a3d2-469c-bd5a-708cf0339b89': TASK.UNREAD_TASKS_REQUEST,
  '2a5cae4b-e877-4339-8ca1-bd61426864ec': TASK.IN_WORK_TASKS_REQUEST,
  '6fc44cc6-9d45-4052-917e-25b1189ab141': TASK.IN_FOCUS_TASKS_REQUEST,
  'd35fe0bc-1747-4eb1-a1b2-3411e07a92a0': TASK.READY_FOR_COMPLITION_TASKS_REQUEST
}

function redirect (title, uid) {
  store.commit(TASK.CLEAN_UP_LOADED_TASKS)
  store.dispatch(UID_TO_ACTION[uid])
  const navElem = {
    name: title,
    key: 'taskListSource',
    value: { uid: uid, param: null }
  }
  store.commit('updateStackWithInitValue', navElem)
  store.commit('basic', { key: 'taskListSource', value: { uid: uid, param: null } })
  store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
}
</script>
<template>
  <!-- <pre>{{ activeCheckbox }}</pre>
  <pre>{{ checkboxes }}</pre>
  <div class="flex justify-end">
    <div class="flex-col items-center w-2/12 bg-gray-200">
      <div class="w-2/2">
        <button class="w-1/2 bg-gray-100" @click="cardMenu.visible ? cardMenu.visible = false : cardMenu.visible = true">Настроить</button>
      </div>
      <div
        class="flex-col absolute bg-green-100 w-[270px] h-[320px]"
        :style="cardMenu.visible === false ? { visibility: 'hidden' } : { visibility: 'visible' }"
      >
        <div class="pl-3.5">
          <div
            v-for="(elem, key) in testObj" :key="elem"
            class="mt-3.5"
          >
            <label>
              <input type="checkbox" :id="key + 'checkbox'" @click="hide(key)" :checked="checkboxes[key] === 'flex' ? true : false ">
              {{ store.state.tasks[key].title }}
            </label>
          </div>
        </div>
      </div>
    </div>
  </div> -->
  <div class="grid grid-rows-2 grid-flow-col max-h-[85vh]">
    <div
      class="flex flex-col bg-white dark:bg-slate-900 rounded-xl min-w-[380px] mb-4 max-w-screen-sm scroll-style mr-3 px-2 pt-2 shadow-sm font-SfProTextNormal"
      :id="key"
      v-for="(elem, key, idx) in testObj"
      :key="elem"
    >
      <taskhead>
        <template v-slot:block-name>
          <span
            class="hover:cursor-pointer"
            @click="redirect(store.state.tasks[key].title, store.state.tasks[key].link)">
              {{ store.state.tasks[key].title }}
          </span>
        </template>
        <template #icon>
          <icon
            :path="icons[iconsKeys[idx]].path"
            :height="icons[iconsKeys[idx]].height"
            :width="icons[iconsKeys[idx]].width"
            :viewBox="icons[iconsKeys[idx]].viewBox"
            class="text-gray-500"
          />
        </template>
      </taskhead>
      <div class="scroll-style">
        <div
          v-for="(task, taskIdx) in testObj[key]"
          :key="task.uid"
          class="p-2 rounded-xl"
          :style="task.uid_marker !== '00000000-0000-0000-0000-000000000000' ? {backgroundColor: colors[task.uid_marker].back_color, color:  '#000000'} : ''"
        >
          <div class="flex">
            <div class="flex order-first">
              <task-status :task="task" />
            </div>
            <div class="font-normal">
              <span
                class="max-w-full break-words text-sm"
              >
                {{ !task ? '' : task.name  }}
              </span>
            </div>
          </div>
          <div class="flex flex-wrap items-center text-xs text-white">
            <!-- customer -->
            <div>
              <img
                class="w-[22px] h-[22px] border-solid border-2 rounded-md"
                :class="task.uid_performer === user.userData.current_user_uid ? 'border-red-500' : 'border-gray-400' "
                :src="employees[task.uid_customer] === undefined ? '' : employees[task.uid_customer].fotolink"
              >
            </div>
            <div
              class="tag-label cursor-default p-1 text-xs flex items-center rounded-lg ml-[4px]"
              :class="task.uid_performer === user.userData.current_user_uid ? 'bg-red-500' : 'bg-gray-400'"
            >
              {{ task.customer_name }}
            </div>
            <div
              v-if="(employees[task.uid_customer] !== undefined) && employees[task.uid_customer] !== employees[task.uid_performer]"
              class="tag-label cursor-default p-1 text-xs flex items-center rounded-lg ml-[4px]"
              :class="task.uid_customer === user.userData.current_user_uid ? 'bg-lime-500' : 'bg-gray-400'"
            >
                <icon
                  :path="task.performerreaded ? performerRead.path : performerNotRead.path"
                  :width="task.performerreaded ? performerRead.width : performerNotRead.width"
                  :height="task.performerreaded ? performerRead.height : performerNotRead.height"
                  :viewbox="task.performerreaded ? performerRead.height : performerNotRead.height"
                  class="mr-[4px]"
                />
                {{ !employees[task.uid_performer] ? '' : employees[task.uid_performer].name}}
            </div>
            <!-- tags -->
            <div
              v-for="j in testObj[key][taskIdx].tags.length"
              :key="j"
              class="tag-label cursor-default p-1 px-2 text-xs rounded-lg mr-1 flex items-center text-white bg-gray-400 order-first"
              :style="{ backgroundColor: tags[testObj[key][taskIdx].tags[j - 1]].back_color }"
            >
              {{ !tags[testObj[key][taskIdx].tags[j - 1]] ? '' : tags[testObj[key][taskIdx].tags[j - 1]].name }}
            </div>
            <div
              v-if="task.uid_project !== '00000000-0000-0000-0000-000000000000'"
              class="p-1 order-last flex align-items justify-around"
            >
              <icon
                :path="project.path"
                :height="project.height"
                :width="project.width"
                :viewBox="project.viewBox"
              />
              <span class="ml-1">{{ !projects[task.uid_project] ? '' : projects[task.uid_project].name }}</span>
            </div>
          </div>
        </div>
        <div
          v-if="!testObj[key].length"
          class="m-2 p-2"
        >
          <div class="font-normal">
            У вас пока нет задач этой категории!
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
