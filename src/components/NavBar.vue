<script setup>
import { computed, watch, ref } from 'vue'
import { visitChildren } from '@/store/helpers/functions'
import { useStore } from 'vuex'
import {
  mdiForwardburger,
  mdiBackburger,
  mdiMenu
} from '@mdi/js'
import NavBarItem from '@/components/NavBarItem.vue'
import Icon from '@/components/Icon.vue'
import Popper from 'vue3-popper'
import NavBarSearch from '@/components/NavBarSearch.vue'
import properties from '@/icons/properties.js'
import add from '@/icons/add.js'
import arrowForward from '@/icons/arrow-forward.js'
import arrowDown from '@/icons/arrow-down.js'

import * as TASK from '@/store/actions/tasks'
import { PATCH_SETTINGS } from '@/store/actions/navigator.js'
import { SELECT_PROJECT } from '@/store/actions/projects'

const UID_TO_ACTION = {
  '901841d9-0016-491d-ad66-8ee42d2b496b': TASK.TASKS_REQUEST, // get today's day
  '46418722-a720-4c9e-b255-16db4e590c34': TASK.OVERDUE_TASKS_REQUEST,
  '017a3e8c-79ac-452c-abb7-6652deecbd1c': TASK.OPENED_TASKS_REQUEST,
  '5183b619-3968-4c3a-8d87-3190cfaab014': TASK.UNSORTED_TASKS_REQUEST,
  'fa042915-a3d2-469c-bd5a-708cf0339b89': TASK.UNREAD_TASKS_REQUEST,
  '2a5cae4b-e877-4339-8ca1-bd61426864ec': TASK.IN_WORK_TASKS_REQUEST,
  '6fc44cc6-9d45-4052-917e-25b1189ab141': TASK.IN_FOCUS_TASKS_REQUEST,
  '7af232ff-0e29-4c27-a33b-866b5fd6eade': TASK.PROJECT_TASKS_REQUEST, // private
  '431a3531-a77a-45c1-8035-f0bf75c32641': TASK.PROJECT_TASKS_REQUEST, // shared
  '00a5b3de-9474-404d-b3ba-83f488ac6d30': TASK.TAG_TASKS_REQUEST,
  'ed8039ae-f3de-4369-8f32-829d401056e9': TASK.COLOR_TASKS_REQUEST,
  'd28e3872-9a23-4158-aea0-246e2874da73': TASK.EMPLOYEE_TASKS_REQUEST,
  '169d728b-b88b-462d-bd8e-3ac76806605b': TASK.DELEGATED_TASKS_REQUEST,
  '511d871c-c5e9-43f0-8b4c-e8c447e1a823': TASK.DELEGATED_TO_USER_TASKS_REQUEST,
  'd35fe0bc-1747-4eb1-a1b2-3411e07a92a0': TASK.READY_FOR_COMPLITION_TASKS_REQUEST
}

const store = useStore()

defineProps({
  item: {
    type: Object,
    required: true
  },
  menu: {
    type: Array,
    default: () => []
  }
})

const closeProperties = () => {
  store.dispatch('asidePropertiesToggle', false)
}

const localization = computed(() => store.state.localization.localization)
const isTaskHoverPopperActive = ref(false)
const settings = computed(() => {
  return store.state.navigator.navigator.settings
})
// const isTaskStatusPopperActive = ref(false)
const toggleTaskHoverPopper = (val) => {
  isTaskHoverPopperActive.value = val
}

watch(settings, () => {
  settings.value.show_completed_tasks = !!settings.value.show_completed_tasks
})
const isNavBarVisible = computed(() => !store.state.isFullScreen)

const user = computed(() => store.state.user.user)
const isAsideMobileExpanded = computed(() => store.state.isAsideMobileExpanded)
const isPropertiesMobileExpanded = computed(() => store.state.isPropertiesMobileExpanded)

const navStack = computed(() => store.state.navbar.navStack)
const projects = computed(() => store.state.projects.projects)
const storeNavigator = computed(() => store.state.navigator.navigator)

const menuToggleMobileIcon = computed(() => isAsideMobileExpanded.value ? mdiBackburger : mdiForwardburger)
const menuToggleMobile = () => {
  store.dispatch('asideMobileToggle')
}

const menuOpenLg = () => {
  store.dispatch('asideLgToggle', true)
}

const updateSettings = () => {
  store.dispatch(
    PATCH_SETTINGS,
    {
      show_completed_tasks: settings.value.show_completed_tasks ? 1 : 0,
      add_task_to_begin: settings.value.add_task_to_begin,
      cal_number_of_first_week: settings.value.cal_number_of_first_week,
      cal_show_week_number: settings.value.cal_show_week_number,
      nav_show_tags: settings.value.nav_show_tags,
      nav_show_overdue: settings.value.nav_show_overdue,
      nav_show_summary: settings.value.nav_show_summary,
      nav_show_emps: settings.value.nav_show_emps,
      nav_show_markers: settings.value.nav_show_markers,
      language: settings.value.language,
      stopwatch: settings.value.stopwatch,
      cal_work_time: settings.value.cal_work_time,
      reminders_in_n_minutes: settings.value.reminders_in_n_minutes,
      cal_work_week: settings.value.cal_work_week,
      compact_mode: settings.value.compact_mode
    }
  ).then(() => {
    requestLastVisitedNav()
  })
}

// Copypasted from Home.vue
// TODO: DRY
const requestLastVisitedNav = () => {
  if (store.state.auth.token) {
    // Process saved last visited nav
    if (navStack.value.length && navStack.value.length > 0) {
      if (navStack.value[navStack.value.length - 1].key === 'taskListSource') {
        store.dispatch(UID_TO_ACTION[navStack.value[navStack.value.length - 1].value.uid], navStack.value[navStack.value.length - 1].value.param)
        store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
        store.commit('basic', { key: navStack.value[navStack.value.length - 1].key, value: navStack.value[navStack.value.length - 1].value })
      }
    } else {
      store.commit('basic', { key: 'taskListSource', value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: null } })
      // TODO: here we need localization
      store.commit(
        'updateStackWithInitValue',
        { name: 'Today', key: 'taskListSource', value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: null } }
      )

      store.dispatch(TASK.TASKS_REQUEST, new Date())
        .then(() => {
          store.commit(TASK.CLEAN_UP_LOADED_TASKS)
        })
        .catch((err) => console.log(err))
    }
  }
  // After navigator is loaded we are trying to set up last visited navElement
  // Checking if last navElement is a gridSource
  if (navStack.value.length && navStack.value.length > 0) {
    if (navStack.value[navStack.value.length - 1].key === 'greedSource') {
      store.commit('basic', { key: 'greedPath', value: navStack.value[navStack.value.length - 1].greedPath })
      store.commit('basic', { key: 'mainSectionState', value: 'greed' })

      // If last navElement is related to processed navigator instance with 'new_' prefix
      // then we pass entire object from storeNavigator
      if (['new_private_projects', 'new_emps', 'new_delegate'].includes(navStack.value[navStack.value.length - 1].greedPath)) {
        store.commit('basic', { key: navStack.value[navStack.value.length - 1].key, value: storeNavigator.value[navStack.value[navStack.value.length - 1].greedPath] })

      // if last visited navElemen is in nested in children, then we trying to find these children with visitChildren fucntion
      // from storeNavigator
      } else if (['tags_children', 'projects_children'].includes(navStack.value[navStack.value.length - 1].greedPath)) {
        if (navStack.value[navStack.value.length - 1].greedPath === 'tags_children') {
          // nested lookup for tags
          visitChildren(storeNavigator.value.tags.items, value => {
            if (value.uid === navStack.value[navStack.value.length - 1].uid) {
              store.commit('basic', { key: navStack.value[navStack.value.length - 1].key, value: value.children })
            }
          })
        }

        // nested lookup for shared and private projects
        if (navStack.value[navStack.value.length - 1].greedPath === 'projects_children') {
          // Requests project's tasks
          store.dispatch(UID_TO_ACTION[navStack.value[navStack.value.length - 1].global_property_uid], navStack.value[navStack.value.length - 1].uid)
          store.commit('basic', { key: 'taskListSource', value: { uid: navStack.value[navStack.value.length - 1].global_property_uid, param: navStack.value[navStack.value.length - 1].uid } })

          visitChildren(storeNavigator.value.new_private_projects[0].items, value => {
            if (value.uid === navStack.value[navStack.value.length - 1].uid) {
              store.commit('basic', { key: navStack.value[navStack.value.length - 1].key, value: value.children })
            }
          })
          visitChildren(storeNavigator.value.new_private_projects[1].items, value => {
            if (value.uid === navStack.value[navStack.value.length - 1].uid) {
              store.commit('basic', { key: navStack.value[navStack.value.length - 1].key, value: value.children })
            }
          })
        }
      // colors
      } else {
        store.commit('basic', { key: navStack.value[navStack.value.length - 1].key, value: storeNavigator.value[navStack.value[navStack.value.length - 1].greedPath].items })
      }
    }
  }
}

const clickOnGridCard = (item, index) => {
  if (!item) {
    return
  }
  store.commit('removeAllFromStackAfterIndex', index)

  store.commit('basic', { key: 'greedPath', value: item.greedPath })
  store.commit('basic', { key: 'mainSectionState', value: 'greed' })

  if (['new_private_projects', 'new_emps', 'new_delegate'].includes(item.greedPath)) {
    store.commit('basic', { key: item.key, value: storeNavigator.value[item.greedPath] })
  } else if (['tags_children', 'projects_children'].includes(item.greedPath)) {
    if (item.greedPath === 'tags_children') {
      visitChildren(storeNavigator.value.tags.items, value => {
        if (value.uid === item.uid) {
          store.commit('basic', { key: item.key, value: value.children })
        }
      })
    }
    if (item.greedPath === 'projects_children') {
      // Request project's tasks
      store.dispatch(UID_TO_ACTION[item.global_property_uid], item.uid)
      store.commit('basic', { key: 'taskListSource', value: { uid: item.global_property_uid, param: item.uid } })
      visitChildren(storeNavigator.value.new_private_projects[0].items, value => {
        if (value.uid === item.uid) {
          store.commit('basic', { key: item.key, value: value.children })
        }
      })
      visitChildren(storeNavigator.value.new_private_projects[1].items, value => {
        if (value.uid === item.uid) {
          store.commit('basic', { key: item.key, value: value.children })
        }
      })
    }
  } else {
    store.commit('basic', { key: item.key, value: storeNavigator.value[item.greedPath].items })
  }
}

const openProjectProperties = (project, parentProjectUid = '') => {
  if (!isPropertiesMobileExpanded.value) {
    store.dispatch('asidePropertiesToggle', true)
  }

  store.commit('basic', { key: 'propertiesState', value: 'project' })

  // create empty instanse of project
  if (!project || parentProjectUid) {
    project = {
      uid_parent: parentProjectUid,
      color: '',
      comment: '',
      plugin: '',
      collapsed: 0,
      isclosed: 0,
      order: 0,
      group: 0,
      show: 0,
      favorite: 0,
      quiet: 0,
      email_creator: user.value.current_user_email,
      members: [user.value.current_user_email],
      children: [],
      uid: '',
      name: '',
      bold: 0
    }
  } else {
    project = projects.value[project]
  }
  store.commit(SELECT_PROJECT, project)
}
</script>

<template>
  <nav
    v-show="isNavBarVisible"
    class="top-0 left-0 right-0 fixed flex h-14 z-30 bg-slate-100
    transition-position xl:ml-80 w-auto lg:items-center dark:bg-gray-800 dark:border-gray-800"
    :class="{ 'ml-80':isAsideMobileExpanded, 'mr-96':isPropertiesMobileExpanded}"
  >
    <div class="flex-1 items-stretch flex h-14 py-2 pl-3">
      <nav-bar-item
        type="flex lg:hidden"
        @click.prevent="menuToggleMobile"
      >
        <icon
          :path="menuToggleMobileIcon"
          size="24"
        />
      </nav-bar-item>
      <nav-bar-item
        type="hidden lg:flex xl:hidden"
        @click.prevent="menuOpenLg"
      >
        <icon
          :path="mdiMenu"
          size="24"
        />
      </nav-bar-item>
    </div>
    <div class="nav-scroll">
      <nav-bar-item
        v-for="(navItem, index) in navStack"
        :key="index"
        class="px-1 group"
      >
        <span
          v-if="navItem && navItem.name"
          class="text-black dark:bg-gray-700 dark:text-gray-100 rounded-lg breadcrumbs"
          @click.stop="clickOnGridCard(navItem, index), closeProperties()"
        >
          {{ navItem.name.length > 15 ? navItem.name.slice(0, 15) + '...' : (navItem.name.includes(new Date().getDate()) ? 'Сегодня' : navItem.name) }}
          <Popper
            class="items-center"
            :class="isDark ? 'dark' : 'light'"
            placement="bottom"
            @click.stop="toggleTaskHoverPopper(true)"
            @open:popper="toggleTaskHoverPopper(true)"
            @close:popper="toggleTaskHoverPopper(false)"
          >

            <template #content>
              <div class="flex flex-col text-sm w-60">
                <div
                  class="flex cursor-pointer items-center hover:bg-gray-100 hover:dark:bg-stone-800 py-0.5 px-1 rounded-md"
                  @click="openProjectProperties(navItem.uid)"
                >
                  <icon
                    class="mr-2 text-gray-500 p-1"
                    :path="properties.path"
                    :width="20"
                    :height="20"
                    :box="properties.viewBox"
                  />
                  Открыть свойства проекта
                </div>
                <div
                  v-if="projects[navItem.uid] && projects[navItem.uid].email_creator === user.current_user_email"
                  class="flex cursor-pointer items-center hover:bg-gray-100 hover:dark:bg-stone-800 py-0.5 px-1 rounded-md"
                  @click="openProjectProperties(false, navItem.uid)"
                >

                  <icon
                    class="mr-2 text-gray-500 p-2"
                    :path="add.path"
                    :width="20"
                    :height="20"
                    :box="add.viewBox"
                  />
                  Добавить подпроект
                </div>
              </div>
            </template>
            <icon
              v-if="navItem.greedPath === 'projects_children' && index === (navStack.length - 1)"
              class="invisible ml-0.5 text-gray-500 group-hover:visible"
              :path="arrowDown.path"
              :width="10"
              :height="10"
              :box="arrowDown.viewBox"
            />
          </Popper>
        </span>
        <div>
          <icon
            v-if="index !== navStack.length - 1"
            class="ml-2 text-gray-500"
            :path="arrowForward.path"
            :width="6"
            :height="12"
            :box="arrowForward.viewBox"
          />
        </div>
      </nav-bar-item>
    </div>
    <div class="flex-none items-stretch flex h-14" v-if="navStack[0].greedPath !== 'new_private_projects' && navStack[0].greedPath !== 'new_delegate' && navStack[0].name !== 'Рабочий стол'">
      <nav-bar-item class="px-3">
        <Popper
          class="items-center"
          arrow
          :class="isDark ? 'dark' : 'light'"
          placement="bottom"
        >
          <template #content>
            <div
              class="w-60 flex flex-col"
            >
              <div class="flex items-center justify-between">
                <p class="text-sm font-semibold mr-1">
                  {{ localization.show_completed_tasks }}
                </p>
                <input
                  v-if="settings"
                  v-model="settings.show_completed_tasks"
                  class="w-6 h-6"
                  type="checkbox"
                  @change="updateSettings"
                >
              </div>
            </div>
          </template>
          <icon
            :path="properties.path"
            :width="properties.width"
            :height="properties.height"
            :box="properties.viewBox"
          />
        </Popper>
      </nav-bar-item>
      <!-- Search -->
      <nav-bar-item class="rounded-lg hover:text-gray-700 cursor-auto px-0">
        <svg
          width="21"
          height="21"
          viewBox="0 0 21 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 20L15.514 15.506L20 20ZM18 9.5C18 11.7543 17.1045 13.9163 15.5104 15.5104C13.9163 17.1045 11.7543 18 9.5 18C7.24566 18 5.08365 17.1045 3.48959 15.5104C1.89553 13.9163 1 11.7543 1 9.5C1 7.24566 1.89553 5.08365 3.48959 3.48959C5.08365 1.89553 7.24566 1 9.5 1C11.7543 1 13.9163 1.89553 15.5104 3.48959C17.1045 5.08365 18 7.24566 18 9.5V9.5Z"
            stroke="black"
            stroke-opacity="0.5"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </nav-bar-item>
      <nav-bar-item class="px-0">
        <nav-bar-search :placeholder="localization.search" />
      </nav-bar-item>
    </div>
  </nav>
</template>
