<template>
  <!-- Confirm modal -->
  <modal-box-confirm
    v-model="showConfirm"
    button="warning"
    has-button
    has-cancel
    button-label="Delete"
    @confirm="removeTask(lastSelectedTaskUid)"
  >
    <p
      v-if="storeTasks[lastSelectedTaskUid]"
      class="text-center"
    >
      Вы действительно хотите удалить выбраную <strong>"{{ storeTasks[lastSelectedTaskUid].info.name }}"</strong> задачу?
      <span
        v-if="storeTasks[lastSelectedTaskUid].info.has_children"
      >
      (с подзадачами) в количестве: {{storeTasks[lastSelectedTaskUid].children.length}}
      </span>
    </p>
  </modal-box-confirm>
  <inspector-modal-box
    v-model="showInspector"
    button="warning"
    has-button
    has-cancel
    button-label="Delete"
  />

  <!-- Add task input -->
  <div
    v-if="taskListSource && !DONT_SHOW_TASK_INPUT_UIDS[taskListSource.uid]"
    class="fixed-create flex"
    :class="newConfig.listHasChildren ? 'pl-8' : 'pl-0'"
  >
    <button
      class="bg-orange-500 px-2 rounded-xl text-white mr-1 ml-1 hover:bg-orange-500 bg-opacity-70"
      @click="showInspector = true"
    >
      Поручить
    </button>
    <div
      class="flex items-center bg-gray-600 dark:bg-gray-700 bg-opacity-70 rounded-xl w-full"
    >
      <div
        class="flex items-center pl-3"
        :class="{ 'bg-gray-500 p-3 rounded-l-xl cursor-pointer': Object.keys(copiedTasks).length }"
        @click="pasteCopiedTasks('00000000-0000-0000-0000-000000000000')"
      >
        <svg
          :class="{ 'mr-2': Object.keys(copiedTasks).length }"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.00011 2.3457V8.4034M8.00011 8.4034V14.4611M8.00011 8.4034H14.4617M8.00011 8.4034H1.53857"
            stroke="#FFF"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
        <div
          v-if="Object.keys(copiedTasks).length"
          class="flex items-center justify-center bg-rose-600 rounded-full w-6 h-6"
        >
          <p class="text-white text-sm font-bold">
            {{ Object.keys(copiedTasks).length }}
          </p>
        </div>
      </div>
      <TaskListEdit
        ref="root"
        v-model="createTaskText"
        class="w-full text-white"
        :placeholder="'Enter task name'"
        borderless
        transparent
        @keyup.enter="createTask"
      />
    </div>
  </div>

  <EmptyTasksListPics
    v-if="!Object.keys(storeTasks).length && status != 'loading'"
  />

  <!-- Skeleton -->
  <TasksSkeleton
    v-if="status == 'loading'"
    :class="newConfig.listHasChildren ? 'pl-8' : 'pl-0'"
  />
  <!-- vue3-treeview -->
  <tree
    v-if="status == 'success'"
    :nodes="storeTasks"
    :config="newConfig"
    class="mt-0.5"
    @nodeOpened="nodeExpanding"
    @nodeFocus="nodeSelected"
    @nodeDragend="nodeDragEnd"
  >
    <template #before-input="props">
      <div
        :id="props.node.info.uid"
        class="group task-node flex-col items-center w-full bg-white p-2 rounded-xl dark:bg-gray-900 dark:border-gray-700 border border-gray-300 my-0.5 relative"
        :style="{ backgroundColor: getValidBackColor(colors[props.node.info.uid_marker]?.back_color) }"
        :class="{ 'bg-gray-200 dark:bg-gray-800': (props.node.info.status == 1 || props.node.info.status == 7) && props.node.info.uid_marker == '00000000-0000-0000-0000-000000000000', 'ring-2 ring-orange-400 border border-orange-400': props.node.id === lastSelectedTaskUid }"
        @click.shift="clickAndShift(props.node)"
        @click.exact="selectedTasks = {}"
      >
        <!--
        DEBUG TASK INFO, don't remove this comment
        <pre class="text-[10px] leading-none font-bold text-green-900">state: {{ props.node.info }}</pre>
        <p class="text-[10px] leading-none">parent: {{ props.node.parent }}</p>
        <pre class="text-[10px] leading-none font-bold text-rose-500">state: {{ props.node.state }}</pre>
        <p class="text-[10px] leading-none">type: {{ props.node.info.type }}</p>
        <p class="text-[10px] leading-none mb-5">order_new: <strong>{{ props.node.info.order_new }}</strong></p>
        <p class="text-[10px] leading-none">id: <strong>{{ props.node.id  }}</strong></p>
        <pre class="text-[10px] leading-none font-bold text-yellow-500">children: {{ props.node.children  }}</pre>
        <pre class="text-[10px] leading-none font-bold text-yellow-500">tags: {{ props.node.tags}}</pre>
        -->
        <Transition>
          <div
            class="absolute hidden group-hover:flex right-2 top-2 bg-gray-200 dark:bg-gray-800 rounded-lg items-cetner justify-center py-0.5 px-3"
            :style="{ backgroundColor: getValidBackColor(colors[props.node.info.uid_marker]?.back_color) }"
          >
            <Icon
              :path="subtask.path"
              class="text-gray-600 dark:text-white mr-3 cursor-pointer"
              :box="subtask.viewBox"
              :width="subtask.width"
              :style="{ color: getValidForeColor(colors[props.node.info.uid_marker]?.fore_color) }"
              :height="subtask.height"
              @click.stop="addSubtask(props.node.info);"
            />

            <!-- Task action popper -->
            <Popper
              arrow
              :class="isDark ? 'dark' : 'light'"
              placement="auto"
              @click.stop="toggleTaskHoverPopper(true)"
              @open:popper="toggleTaskHoverPopper(true)"
              @close:popper="toggleTaskHoverPopper(false)"
            >
              <template #content="{ close }">
                <div class="flex flex-col w-40">
                  <!-- Set task for tomorrow -->
                  <div
                    v-if="props.node.info.uid_customer == user.current_user_uid"
                    class="flex cursor-pointer items-center hover:bg-gray-100 hover:dark:bg-stone-800 py-0.5 px-1.5 rounded-xl"
                    @click="moveTaskTomorrow(props.node.info)"
                  >
                    <Icon
                      :path="fortomorrow.path"
                      class="text-gray-600 dark:text-white mr-3 cursor-pointer"
                      :box="fortomorrow.viewBox"
                      :width="fortomorrow.width"
                      :height="fortomorrow.height"
                    />
                    <p>{{ localization.Tomorrow }}</p>
                  </div>

                  <!-- Copy task name -->
                  <div
                    class="flex cursor-pointer items-center hover:bg-gray-100 hover:dark:bg-stone-800 py-0.5 px-1.5 rounded-xl"
                    @click="copyTaskName(props.node.info); close();"
                  >
                    <Icon
                      :path="copy.path"
                      class="text-gray-600 dark:text-white mr-3 cursor-pointer"
                      :box="copy.viewBox"
                      :width="copy.width"
                      :height="copy.height"
                    />
                    <p>{{ props.node.info.taskNameCopied ? 'Copied!' : localization.copy_taskname }}</p>
                  </div>

                  <!-- Copy task -->
                  <div
                    class="flex items-center py-0.5 px-1.5 rounded-xl"
                    :class="{ 'cursor-pointer': !copiedTasks[props.node.info.uid], 'hover:bg-gray-100 hover:dark:bg-stone-800': !copiedTasks[props.node.info.uid], 'text-gray-200': copiedTasks[props.node.info.uid] }"
                    @click="copyTask(props.node.info)"
                  >
                    <Icon
                      :path="copy.path"
                      class="text-gray-600 dark:text-white mr-3 cursor-pointer"
                      :class="{ 'text-gray-200': copiedTasks[props.node.info.uid] }"
                      :box="copy.viewBox"
                      :width="copy.width"
                      :height="copy.height"
                    />
                    <p>{{ copiedTasks[props.node.info.uid] ? 'Copied' : 'Copy' }}</p>
                  </div>

                  <!-- Paste task -->
                  <div
                    v-if="Object.keys(copiedTasks).length"
                    class="flex cursor-pointer items-center py-0.5 px-1.5 rounded-xl hover:dark:bg-stone-800"
                    @click="pasteCopiedTasks(props.node.id)"
                  >
                    <Icon
                      :path="copy.path"
                      class="text-gray-600 dark:text-white mr-3 cursor-pointer"
                      :box="copy.viewBox"
                      :width="copy.width"
                      :height="copy.height"
                    />
                    <p>Paste</p>
                  </div>

                  <!-- Cut task -->
                  <div
                    v-if="props.node.info.uid_customer == user.current_user_uid"
                    class="flex cursor-pointer items-center hover:bg-gray-100 hover:dark:bg-stone-800 py-0.5 px-1.5 rounded-xl"
                    @click="cutTask(props.node.info); close();"
                  >
                    <Icon
                      :path="cut.path"
                      class="text-gray-600 dark:text-white mr-3 cursor-pointer"
                      :box="cut.viewBox"
                      :width="cut.width"
                      :height="cut.height"
                    />
                    <p>Cut</p>
                  </div>

                  <!-- Delete task -->
                  <div
                    v-if="props.node.info.uid_customer == user.current_user_uid"
                    class="flex cursor-pointer items-center hover:bg-gray-100 hover:dark:bg-stone-800 py-0.5 px-1.5 rounded-xl"
                    @click="showConfirm = true; lastSelectedTaskUid = props.node.id"
                  >
                    <Icon
                      :path="bin.path"
                      class="text-gray-600 dark:text-white mr-3 cursor-pointer"
                      :box="bin.viewBox"
                      :width="bin.width"
                      :height="bin.height"
                    />
                    <p>{{ localization.remove }}</p>
                  </div>
                </div>
              </template>
              <Icon
                :path="taskoptions.path"
                class="text-gray-600 dark:text-white cursor-pointer h-full"
                :box="taskoptions.viewBox"
                :width="taskoptions.width"
                :style="{ color: getValidForeColor(colors[props.node.info.uid_marker]?.fore_color) }"
                :height="taskoptions.height"
              />
            </Popper>
          </div>
        </Transition>

        <!-- Name, Status -->
        <div
          class="flex"
        >
          <div
            class="flex items-center"
          >
            <TaskStatus
              :task="props.node.info"
            />

            <!-- Editable name -->
            <contenteditable
              v-model="props.node.info.name"
              tag="div"
              @focusout="clearTaskFocus(props.node.info)"
              class="taskName p-0.5 ring-0 outline-none max-w-7xl"
              :contenteditable="props.node.info._isEditable"
              placeholder="Enter task name"
              :no-nl="true"
              :no-html="true"
              :class="{ 'uppercase': !props.node.info._isEditable && colors[props.node.info.uid_marker] && colors[props.node.info.uid_marker].uppercase, 'text-gray-500': props.node.info.status == 1 || props.node.info.status == 7, 'line-through': props.node.info.status == 1 || props.node.info.status == 7, 'font-extrabold': props.node.info.readed == 0 }"
              :style="{ color: getValidForeColor(colors[props.node.info.uid_marker]?.fore_color) }"
              @dblclick.stop="editTaskName(props.node.id)"
              @keyup.enter="updateTask($event, props.node.info); props.node.info._isEditable = false;"
            />
          </div>
        </div>

        <!-- Tags, Overdue, Customer, Performer -->
        <div
          v-if="props.node.info.uid_customer == '00000000-0000-0000-0000-000000000000' || props.node.info.email_performer || props.node.info.is_overdue || props.node.info.tags || props.node.info.uid_project == '00000000-0000-0000-0000-000000000000' || props.node.info.term_customer || props.node.info.checklist || props.node.info.has_files || props.node.info.has_msgs || props.node.info.comment || props.node.info.focus"
          class="flex items-center mt-1.5"
        >
          <!-- Customer -->
          <TaskListTagLabel
            v-if="props.node.info.uid_customer != '00000000-0000-0000-0000-000000000000' && employees[props.node.info.uid_customer] && props.node.info.uid_customer != user.current_user_uid"
            :text="employees[props.node.info.uid_customer].name"
            :color-bg-class="{ 'bg-red-500': user.current_user_email == props.node.info.email_performer, 'bg-gray-400': user.current_user_email != props.node.info.email_performer, 'bg-opacity-50': props.node.info.status == 1 || props.node.info.status == 7 }"
          />
          <!-- Performer -->
          <TaskListTagLabel
            v-if="props.node.info.email_performer && employeesByEmail[props.node.info.email_performer] && user.current_user_email != props.node.info.email_performer && employees[props.node.info.uid_customer].email != props.node.info.email_performer"
            :text="employeesByEmail[props.node.info.email_performer].name"
            :icon-width="props.node.info.performerreaded ? performerRead.width : performerNotRead.width"
            :icon-height="props.node.info.performerreaded ? performerRead.height : performerNotRead.height"
            :icon-box="props.node.info.performerreaded ? performerRead.viewBox : performerNotRead.viewBox"
            :icon-path="props.node.info.performerreaded ? performerRead.path : performerNotRead.path"
            :color-bg-class="{ 'bg-gray-400': user.current_user_email != props.node.info.email_performer, 'bg-green-500': user.current_user_uid == props.node.info.uid_customer, 'bg-opacity-50': props.node.info.status == 1 || props.node.info.status == 7 }"
          />
          <!-- Overdue -->
          <TaskListTagLabel
            v-if="props.node.info.is_overdue"
            text="Просрочено"
            color-text-class="text-red-600"
            color-bg-class="bg-red-300 opacity-70"
          />
          <!-- Tags -->
          <template
            v-for="(tag, index) in props.node.info.tags"
            :key="index"
          >
            <TaskListTagLabel
              v-if="tags[tag]"
              :icon-path="tagIcon.path"
              :icon-box="tagIcon.viewBox"
              :text="tags[tag].name"
              :color-bg-style="{ backgroundColor: tags[tag] ? tags[tag].back_color : '' }"
            />
          </template>
          <!-- Project -->
          <TaskListTagLabel
            v-if="taskListSource && props.node.info.uid_project != '00000000-0000-0000-0000-000000000000' && projects[props.node.info.uid_project] && props.node.info.uid_project !== taskListSource.param"
            :icon-path="project.path"
            :icon-box="project.viewBox"
            :text="projects[props.node.info.uid_project].name"
            :color-bg-class="{ 'bg-yellow-400': true, 'bg-opacity-50': props.node.info.status == 1 || props.node.info.status == 7 }"
          />
          <!-- Data -->
          <TaskListIconLabel
            v-if="props.node.info.term_user"
            :icon-path="clock.path"
            :icon-box="clock.viewBox"
            :text="props.node.info.term_user"
          />
          <TaskListIconLabel
            v-if="props.node.info.type !== 1 && props.node.info.type !== 2 && props.node.info.term_customer"
            :icon-path="clock.path"
            :icon-box="clock.viewBox"
            :text="props.node.info.term_customer"
            icon-class="text-red-600"
          />
          <!-- Checklist -->
          <TaskListIconLabel
            v-if="props.node.info.checklist"
            :icon-path="checklist.path"
            :icon-box="checklist.viewBox"
            :text="`${countChecklist(props.node.info.checklist).done} / ${countChecklist(props.node.info.checklist).undone}`"
          />
          <!-- Access -->
          <TaskListIconLabel
            v-if="props.node.info.emails"
            :icon-path="inaccess.path"
            :icon-box="inaccess.viewBox"
            icon-width="14"
            icon-height="14"
          />
          <!-- Files -->
          <TaskListIconLabel
            v-if="props.node.info.has_files"
            :icon-path="file.path"
            :icon-box="file.viewBox"
          />
          <!-- Messages -->
          <TaskListIconLabel
            v-if="props.node.info.has_msgs"
            :icon-path="msgs.path"
            :icon-box="msgs.viewBox"
          />
          <!-- Comment -->
          <TaskListIconLabel
            v-if="props.node.info.comment.replace(/\r?\n|\r/g, '')"
            :icon-path="taskcomment.path"
            :icon-box="taskcomment.viewBox"
          />
          <!-- Focus -->
          <TaskListIconLabel
            v-if="props.node.info.focus"
            :icon-path="taskfocus.path"
            :icon-box="taskfocus.viewBox"
            icon-class="text-red-600"
          />
        </div>
      </div>
    </template>
  </tree>
</template>

<script>
import { computed, ref, nextTick } from 'vue'
import treeview from 'vue3-treeview'
import { useStore } from 'vuex'
import Icon from '@/components/Icon.vue'
import TaskStatus from '@/components/TasksList/TaskStatus.vue'
import EmptyTasksListPics from '@/components/TasksList/EmptyTasksListPics.vue'
import Popper from 'vue3-popper'
import ModalBoxConfirm from '@/components/modals/ModalBoxConfirm.vue'
import InspectorModalBox from '@/components/Inspector/InspectorModalBox.vue'
import contenteditable from 'vue-contenteditable'
import TaskListIconLabel from '@/components/TasksList/TaskListIconLabel.vue'
import TaskListTagLabel from '@/components/TasksList/TaskListTagLabel.vue'
import TaskListEdit from '@/components/TasksList/TaskListEdit.vue'
import TasksSkeleton from '@/components/TasksList/TasksSkeleton.vue'

import * as TASK from '@/store/actions/tasks'

/* Icons */
import file from '@/icons/file.js'
import inaccess from '@/icons/inaccess.js'
import msgs from '@/icons/msgs.js'
import taskcomment from '@/icons/taskcomment.js'
import checklist from '@/icons/checklist.js'
import project from '@/icons/project.js'
import tagIcon from '@/icons/tag.js'
import performerRead from '@/icons/performer-read.js'
import performerNotRead from '@/icons/performer-not-read.js'
import taskfocus from '@/icons/taskfocus.js'
import clock from '@/icons/clock.js'
import subtask from '@/icons/subtask.js'
import taskoptions from '@/icons/taskoptions.js'
import repeat from '@/icons/repeat.js'
import fortomorrow from '@/icons/for-tomorrow.js'
import copy from '@/icons/copy.js'
import cut from '@/icons/cut.js'
import bin from '@/icons/bin.js'
/* /Icons */

export default {
  components: {
    tree: treeview,
    Icon,
    TaskListIconLabel,
    TaskListTagLabel,
    TaskListEdit,
    TasksSkeleton,
    Popper,
    ModalBoxConfirm,
    InspectorModalBox,
    EmptyTasksListPics,
    TaskStatus,
    contenteditable
  },
  setup (props) {
    const store = useStore()
    const loadedTasks = computed(() => store.state.tasks.loadedTasks)
    const employees = computed(() => store.state.employees.employees)
    const employeesByEmail = computed(() => store.state.employees.employeesByEmail)
    const taskListSource = computed(() => store.state.taskListSource)
    const projects = computed(() => store.state.projects.projects)
    const createTaskText = ref('')
    const status = computed(() => store.state.tasks.status)
    const localization = computed(() => store.state.localization.localization)
    const user = computed(() => store.state.user.user)
    const newConfig = computed(() => store.state.tasks.newConfig)
    const storeTasks = computed(() => store.state.tasks.newtasks)
    const isDark = computed(() => store.state.darkMode)
    const isPropertiesMobileExpanded = computed(() => store.state.isPropertiesMobileExpanded)
    const copiedTasks = computed(() => store.state.tasks.copiedTasks)
    const lastSelectedTaskUid = ref('')
    const selectedTasks = ref({})
    const showConfirm = ref(false)
    const showInspector = ref(false)
    const isTaskHoverPopperActive = ref(false)
    const isTaskStatusPopperActive = ref(false)

    const clickAndShift = (arg) => {
      selectedTasks.value[arg.id] = arg.info
    }

    const stop = ref(true)
    const draggables = document.querySelectorAll('.draggable')
    draggables.forEach(node => {
      node.addEventListener('drag', e => {
        stop.value = true
        console.log(e.originalEvent.clientY)
        if (e.originalEvent.clientY < 300) {
          stop.value = false
          scroll(-1)
        }
        if (e.originalEvent.clientY > (window.innerHeight - 150)) {
          stop.value = false
          scroll(1)
        }
      })
      node.addEventListener('dragend', e => {
        stop.value = true
      })
    })

    const scroll = (step) => {
      const scrollY = window.scrollTop()
      window.scrollTop(scrollY + step)
      if (!stop.value) {
        setTimeout(() => {
          scroll(step)
        }, 20)
      }
    }

    const SHOW_TASK_INPUT_UIDS = {
      '901841d9-0016-491d-ad66-8ee42d2b496b': TASK.TASKS_REQUEST, // get today's day
      '5183b619-3968-4c3a-8d87-3190cfaab014': TASK.UNSORTED_TASKS_REQUEST,
      '6fc44cc6-9d45-4052-917e-25b1189ab141': TASK.IN_FOCUS_TASKS_REQUEST,
      '169d728b-b88b-462d-bd8e-3ac76806605b': TASK.DELEGATED_TASKS_REQUEST,
      '7af232ff-0e29-4c27-a33b-866b5fd6eade': TASK.PROJECT_TASKS_REQUEST, // private
      '431a3531-a77a-45c1-8035-f0bf75c32641': TASK.PROJECT_TASKS_REQUEST, // shared
      'd28e3872-9a23-4158-aea0-246e2874da73': TASK.EMPLOYEE_TASKS_REQUEST,
      'ed8039ae-f3de-4369-8f32-829d401056e9': TASK.COLOR_TASKS_REQUEST,
      '00a5b3de-9474-404d-b3ba-83f488ac6d30': TASK.TAG_TASKS_REQUEST
    }

    const toggleTaskHoverPopper = (val) => {
      isTaskHoverPopperActive.value = val
    }

    const editTaskName = (uid) => {
      storeTasks.value[uid].info._isEditable = user.value.current_user_uid === storeTasks.value[uid].info.uid_customer
      document.getElementById(uid).parentNode.draggable = false
      nextTick(() => {
        // select all content in editing task
        const taskName = document.getElementById(uid).querySelector('.taskName')
        const range = document.createRange()
        const sel = document.getSelection()
        taskName.focus({ preventScroll: false })
        range.setStart(taskName, 0)
        range.setEnd(taskName, 1)
        sel.addRange(range)
      })
    }

    const nodeExpanding = (arg) => {
      if (loadedTasks.value[arg.id]) return
      store.dispatch(TASK.SUBTASKS_REQUEST, arg.id)
        .then(() => {
          store.commit(TASK.ADD_LOADED_TASK, arg.id)
          store.commit(TASK.UPDATE_NEW_TASK_LIST, store.state.tasks.subtasks.tasks)

          // remove fake-uid from children array if subtasks are loaded
          for (let i = 0; i < arg.children.length; i++) {
            if (arg.children[i] === 'fake-uid') {
              arg.children.splice(i, 1)
            }
          }

          for (const task of store.state.tasks.subtasks.tasks) {
            arg.children.push(task.uid)
          }
        })
    }

    const countChecklist = (checklist) => {
      const data = { done: 0, undone: 0 }
      for (const line of checklist.split('\r\n\r\n')) {
        data.undone++
        if (+line.split('\r\n')[0] === 1) {
          data.done++
        }
      }
      return data
    }

    function uuidv4 () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      )
    }

    const pad2 = (n) => {
      return (n < 10 ? '0' : '') + n
    }

    const getTodaysDate = (val, isYearFirst = true) => {
      if (val == null) {
        val = new Date()
      }
      if (typeof val === 'string') { // parse date from ISO 8601 string
        val = new Date(val)
      }
      const month = pad2(val.getMonth() + 1)
      const day = pad2(val.getDate())
      const year = pad2(val.getFullYear())
      if (isYearFirst) {
        return year + '-' + month + '-' + day
      } else {
        return day + '-' + month + '-' + year
      }
    }

    const handleTaskSource = (taskData, uidParent) => {
      let data
      if (taskData) {
        taskData.uid = uuidv4()
        taskData.status = 0
        taskData.uid_parent = uidParent
        taskData.uid_customer = user.value.current_user_uid
        taskData.email_performer = ''
        taskData.tags = []
        taskData.uid_marker = ''
        taskData.has_files = false
        taskData.has_msgs = false
        taskData.type = 1
        data = taskData
      } else {
        data = {
          uid: uuidv4(),
          uid_parent: '00000000-0000-0000-0000-000000000000',
          uid_customer: user.value.current_user_uid,
          uid_project: '00000000-0000-0000-0000-000000000000',
          status: 0,
          email_performer: '',
          type: 1,
          name: createTaskText.value,
          comment: ''
        }
      }

      switch (SHOW_TASK_INPUT_UIDS[taskListSource.value.uid]) {
        case TASK.TASKS_REQUEST:
          data.date_begin = getTodaysDate(taskListSource.value.param) + 'T00:00:00'
          data.date_end = getTodaysDate(taskListSource.value.param) + 'T23:59:59'
          break
        case TASK.IN_FOCUS_TASKS_REQUEST:
          data.focus = 1
          break
        case TASK.DELEGATED_TASKS_REQUEST:
          data.email_performer = taskListSource.value.param
          break
        case TASK.PROJECT_TASKS_REQUEST:
          data.uid_project = taskListSource.value.param
          break
        case TASK.EMPLOYEE_TASKS_REQUEST:
          data.email_performer = employees.value[taskListSource.value.param].email
          break
        case TASK.COLOR_TASKS_REQUEST:
          data.uid_marker = taskListSource.value.param
          break
        case TASK.TAG_TASKS_REQUEST:
          data.tags = [taskListSource.value.param]
          break
      }
      console.log(data)
      return data
    }

    const pasteCopiedTasks = (uidParent) => {
      if (!copiedTasks.value) {
        return
      }

      for (const uid in copiedTasks.value) {
        const data = handleTaskSource(copiedTasks.value[uid], uidParent)
        store.dispatch(TASK.CREATE_TASK, data)
      }
      store.commit(TASK.RESET_COPY_TASK)
    }

    const createTask = () => {
      const data = handleTaskSource()
      store.dispatch(TASK.CREATE_TASK, data)
        .then((resp) => {
          // выделяем добавленную задачу
          // и отображаем её свойства
          nodeSelected({ id: data.uid, info: resp.data })
        })
      createTaskText.value = ''
    }

    const updateTask = (event, task) => {
      task.name = task.name.replace(/\r?\n|\r/g, '')
      if (task.name.length > 0) {
        if (task._justCreated) {
          store.dispatch(TASK.CREATE_TASK, task)
        } else {
          store.dispatch(TASK.CHANGE_TASK_NAME, { uid: task.uid, value: task.name })
        }
        task._isEditing = false
      } else if (task.name.length === 0) {
        if (task._justCreated) {
          if (isPropertiesMobileExpanded.value) {
            store.dispatch('asidePropertiesToggle', false)
          }
          store.commit(TASK.REMOVE_TASK, task.uid)
        } else {
          showConfirm.value = true
          // removeTask(task.uid)
        }
      }
      if (task.name !== '') {
        task.name = 'Пусто'
      }
      if (task.uid_customer === user.value.current_user_uid) {
        document.getElementById(task.uid).parentNode.draggable = true
      }
      store.dispatch(TASK.SELECT_TASK, task)
      nextTick(() => { document.getElementById(task.uid).parentNode.click() })
    }
    const clearTaskFocus = (task) => {
      console.log(task.name)
      if (task.name === '') {
        removeTask(task.uid)
      }
      if (isPropertiesMobileExpanded.value) {
        store.dispatch('asidePropertiesToggle', false)
      }
      task._isEditing = false
    }
    const moveTaskTomorrow = (task) => {
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      store.dispatch(
        TASK.CHANGE_TASK_DATE,
        {
          uid_task: task.uid,
          str_date_begin: getTodaysDate(tomorrow) + 'T00:00:00',
          str_date_end: getTodaysDate(tomorrow) + 'T23:59:59',
          reset: 0
        }
      )
        .then(() => {
          store.commit(TASK.REMOVE_TASK, task.uid)
        })
    }

    const copyTaskName = (task) => {
      navigator.clipboard.writeText(task.name)
    }

    const removeTask = (uid) => {
      if (isPropertiesMobileExpanded.value) {
        store.dispatch('asidePropertiesToggle', false)
      }
      store.dispatch(TASK.REMOVE_TASK, uid)
    }

    const gotoNode = (uid) => {
      document.getElementById(uid).parentElement.focus({ preventScroll: false })
      const taskName = document.getElementById(uid).querySelector('.taskName')
      const range = document.createRange()
      const sel = document.getSelection()
      taskName.focus({ preventScroll: false })
      range.setStart(taskName, 1)
      range.collapse(true)
      sel.removeAllRanges()
      sel.addRange(range)
      lastSelectedTaskUid.value = uid
    }

    const addSubtask = (parent) => {
      const newSubtask = {
        uid: uuidv4(),
        uid_customer: user.value.current_user_uid,
        email_performer: parent.email_performer,
        name: '',
        emails: '',
        comment: '',
        tags: [],
        uid_marker: '00000000-0000-0000-0000-000000000000',
        status: 0,
        uid_parent: parent.uid,
        uid_project: parent.uid_project !== '00000000-0000-0000-0000-000000000000' ? parent.uid_project : '00000000-0000-0000-0000-000000000000',
        type: 1,
        SeriesType: 0,
        _isEditing: true,
        _isEditable: true,
        _justCreated: true
      }
      store.dispatch(TASK.SELECT_TASK, newSubtask)
      store.dispatch(TASK.ADD_SUBTASK, newSubtask)
        .then(() => {
          // Don't know the event when I can call edit just created subtask
          // If we don't wait, then we won't focus on just created subtask
          setTimeout(() => {
            document.getElementById(newSubtask.uid).parentNode.draggable = false
            gotoNode(newSubtask.uid)
          }, 200)
        })
    }
    const copyTask = (task) => {
      store.commit(TASK.COPY_TASK, task)
    }

    const cutTask = (task) => {
      store.commit(TASK.COPY_TASK, task)
      removeTask(task.uid)
    }

    const nodeSelected = (arg) => {
      store.commit('basic', { key: 'propertiesState', value: 'task' })

      lastSelectedTaskUid.value = arg.id
      store.dispatch(TASK.SELECT_TASK, arg.info)
      if (!isPropertiesMobileExpanded.value && arg.info.name) {
        store.dispatch('asidePropertiesToggle', true)
      }
    }

    const nodeDragEnd = (node) => {
      if (storeTasks.value[node.dragged.node.id]) {
        // change order in children
        if (storeTasks.value[node.dragged.node.id].parent) {
          const parent = storeTasks.value[storeTasks.value[node.dragged.node.id].parent]
          if (parent.children.length > 1) {
            for (let i = 0; i < parent.children.length; i++) {
              if (parent.children[i] === node.dragged.node.id) {
                if (i === 0) {
                  storeTasks.value[parent.children[i]].info.order_new = storeTasks.value[parent.children[i + 1]].info.order_new - 0.1
                } else if (i > 0 && i !== parent.children.length - 1) {
                  storeTasks.value[parent.children[i]].info.order_new = (storeTasks.value[parent.children[i - 1]].info.order_new + storeTasks.value[parent.children[i + 1]].info.order_new) / 2
                } else {
                  storeTasks.value[parent.children[i]].info.order_new = storeTasks.value[parent.children[i - 1]].info.order_new + 0.1
                }
              }
            }
          }
        } else {
          // change order in root
          if (newConfig.value.roots.length >= 1) {
            for (let i = 0; i < newConfig.value.roots.length; i++) {
              if (newConfig.value.roots[i] === node.dragged.node.id) {
                if (i === 0) {
                  storeTasks.value[newConfig.value.roots[i]].info.order_new = storeTasks.value[newConfig.value.roots[i + 1]].info.order_new - 0.1
                } else if (i > 0 && i !== newConfig.value.roots.length - 1) {
                  storeTasks.value[newConfig.value.roots[i]].info.order_new = (storeTasks.value[newConfig.value.roots[i - 1]].info.order_new + storeTasks.value[newConfig.value.roots[i + 1]].info.order_new) / 2
                } else {
                  storeTasks.value[newConfig.value.roots[i]].info.order_new = storeTasks.value[newConfig.value.roots[i - 1]].info.order_new + 0.1
                }
              }
            }
          }
        }
      }

      store.dispatch(
        TASK.CHANGE_TASK_PARENT_AND_ORDER,
        {
          uid: node.dragged.node.id,
          parent: node.dragged.node.parent ?? '00000000-0000-0000-0000-000000000000',
          order: node.dragged.node.info.order_new ?? 0
        }
      )
    }

    return {
      clearTaskFocus,
      editTaskName,
      storeTasks,
      newConfig,
      showConfirm,
      showInspector,
      selectedTasks,
      clickAndShift,
      nodeDragEnd,
      isDark,
      status,
      tags: computed(() => store.state.tasks.tags),
      employees,
      employeesByEmail,
      isTaskHoverPopperActive,
      isTaskStatusPopperActive,
      projects,
      toggleTaskHoverPopper,
      nodeExpanding,
      nodeSelected,
      lastSelectedTaskUid,
      countChecklist,
      createTask,
      pasteCopiedTasks,
      copiedTasks,
      copyTask,
      cutTask,
      updateTask,
      removeTask,
      copyTaskName,
      moveTaskTomorrow,
      addSubtask,
      createTaskText,
      taskListSource,
      SHOW_TASK_INPUT_UIDS,
      file,
      inaccess,
      msgs,
      user,
      taskcomment,
      checklist,
      colors: computed(() => store.state.colors.colors),
      localization
    }
  },
  data () {
    const DONT_SHOW_TASK_INPUT_UIDS = {
      '46418722-a720-4c9e-b255-16db4e590c34': TASK.OVERDUE_TASKS_REQUEST,
      '017a3e8c-79ac-452c-abb7-6652deecbd1c': TASK.OPENED_TASKS_REQUEST,
      'fa042915-a3d2-469c-bd5a-708cf0339b89': TASK.UNREAD_TASKS_REQUEST,
      '2a5cae4b-e877-4339-8ca1-bd61426864ec': TASK.IN_WORK_TASKS_REQUEST,
      'd35fe0bc-1747-4eb1-a1b2-3411e07a92a0': TASK.READY_FOR_COMPLITION_TASKS_REQUEST,
      '511d871c-c5e9-43f0-8b4c-e8c447e1a823': TASK.DELEGATED_TO_USER_TASKS_REQUEST
    }
    return {
      DONT_SHOW_TASK_INPUT_UIDS,
      project,
      tagIcon,
      performerNotRead,
      performerRead,
      taskfocus,
      clock,
      subtask,
      taskoptions,
      repeat,
      fortomorrow,
      copy,
      cut,
      bin
    }
  },
  methods: {
    print (value) {
      console.log(value)
    },
    getValidForeColor (foreColor) {
      if (foreColor && foreColor !== '#A998B6') return foreColor
      return ''
    },
    getValidBackColor (backColor) {
      if (backColor && backColor !== '#A998B6') return backColor
      return ''
    }
  }
}
</script>

<style>
.tree-level {
  flex: 1
}

.taskName, .tag-label, .tag-overdue, .performer, .customer, .checklist-tag, .term-tag{
  cursor: default;
}

.icon-wrapper {
  padding: 0;
  min-width: 0;
  flex-shrink: 0;
  display: flex;
  align-items: start;
  justify-content: center;
  width: 35px;
}

.input-wrapper {
  margin-left: .75em
}

.icon-wrapper svg {
  height: 15px;
  width: 15px;
}

.node-wrapper {
  min-height: 32px;
  display: flex;
  align-items: center;
  flex: 1;
  word-wrap: break-word;
  font-size: 14px;
  outline: none
}

.node-wrapper:focus-within .task-node {
  @apply ring-2 ring-orange-400 border border-orange-400
}

.node-wrapper.disabled .checkbox-wrapper.checked {
  background: rgba(0, 0, 0, .26)
}

.node-wrapper.disabled .checkbox-wrapper.indeterminate {
  background: rgba(0, 0, 0, .26)
}

.node-wrapper.disabled .checkbox-wrapper {
  border-color: #00000042
}

.checkbox-wrapper, checked:after {
  transform: translate(.25em, .3365384615em) rotate(-45deg);
  width: .7em;
  height: .3em;
  border: .125em solid #fff;
  border-top-style: none;
  border-right-style: none
}

.checkbox-wrapper.indeterminate:after {
  transform: translate(.25em, .3365384615em) rotate(0);
  width: .7em;
  height: .3em;
  border: .125em solid #fff;
  border-top-style: none;
  border-right-style: none;
  border-left-style: none
}

.checkbox-wrapper:after {
  content: "";
  position: absolute;
  left: 0;
  top: 0
}

.node-over {
  border-top: solid 2px #5C6BC0
}

.node-in {
  background-color: #bdbdbd
}

.node-under {
  border-bottom: solid 2px #5C6BC0
}

.progress {
  position: relative;
  height: 4px;
  display: block;
  width: 100%;
  background-color: #aab6fe;
  border-radius: 2px;
  background-clip: padding-box;
  margin: 0.5rem 0 1rem 0;
  overflow: hidden;
}
.progress .indeterminate {
  background-color: #3f51b5;
}
.progress .indeterminate:before {
  content: "";
  position: absolute;
  background-color: inherit;
  top: 0;
  left: 0;
  bottom: 0;
  will-change: left, right;
  -webkit-animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395)
    infinite;
  animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
}
.progress .indeterminate:after {
  content: "";
  position: absolute;
  background-color: inherit;
  top: 0;
  left: 0;
  bottom: 0;
  will-change: left, right;
  -webkit-animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1)
    infinite;
  animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1)
    infinite;
  -webkit-animation-delay: 1.15s;
  animation-delay: 1.15s;
}

@-webkit-keyframes indeterminate {
  0% {
    left: -35%;
    right: 100%;
  }
  60% {
    left: 100%;
    right: -90%;
  }
  100% {
    left: 100%;
    right: -90%;
  }
}
@keyframes indeterminate {
  0% {
    left: -35%;
    right: 100%;
  }
  60% {
    left: 100%;
    right: -90%;
  }
  100% {
    left: 100%;
    right: -90%;
  }
}
@-webkit-keyframes indeterminate-short {
  0% {
    left: -200%;
    right: 100%;
  }
  60% {
    left: 107%;
    right: -8%;
  }
  100% {
    left: 107%;
    right: -8%;
  }
}
@keyframes indeterminate-short {
  0% {
    left: -200%;
    right: 100%;
  }
  60% {
    left: 107%;
    right: -8%;
  }
  100% {
    left: 107%;
    right: -8%;
  }
}

.level-enter-active,
.level-leave-active {
  transition: opacity 0.2s ease;
}

.level-enter-from,
.level-leave-to {
  opacity: 0;
  transition: opacity 0.2s ease;
  transform: 0
}

.tree-node {
  @apply ring-0 border-0
}

.dark {
  --popper-theme-background-color: #333333;
  --popper-theme-background-color-hover: #333333;
  --popper-theme-text-color: white;
  --popper-theme-border-width: 0px;
  --popper-theme-border-radius: 0.75rem;
  --popper-theme-padding: 10px;
  --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.25);
}

.light {
  --popper-theme-background-color: #ffffff;
  --popper-theme-background-color-hover: #ffffff;
  --popper-theme-text-color: #333333;
  --popper-theme-border-width: 1px;
  --popper-theme-border-style: solid;
  --popper-theme-border-color: #eeeeee;
  --popper-theme-border-radius: 0.75rem;
  --popper-theme-padding: 10px;
  --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.25);
}

.fixed-create {
  position: sticky;
  top: 55px;
  z-index: 1;
  margin-bottom: 1px;
  padding-right: 10px;
}

[contenteditable=true]:empty:before{
  content: attr(placeholder);
  pointer-events: none;
  display: block; /* For Firefox */
  color: gray
}
</style>
