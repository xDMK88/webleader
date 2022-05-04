<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import TaskProperties from '@/components/properties/TaskProperties.vue'
import ProjectProperties from '@/components/properties/ProjectProperties.vue'
import ColorProperties from '@/components/properties/ColorProperties.vue'
import TagProperties from '@/components/properties/TagProperties.vue'
import EmployeeProperties from '@/components/properties/EmployeeProperties.vue'
import DepartmentProperties from '@/components/properties/DepartmentProperties.vue'
import Icon from '@/components/Icon.vue'
import close from '@/icons/close.js'

export default {
  components: {
    TaskProperties,
    ProjectProperties,
    ColorProperties,
    TagProperties,
    EmployeeProperties,
    DepartmentProperties,
    Icon
  },
  data: () => {
    const store = useStore()
    const selectedTask = computed(() => store.state.tasks.selectedTask)
    const propertiesState = computed(() => store.state.propertiesState)
    const closeProperties = () => {
      store.dispatch('asidePropertiesToggle', false)
    }
    return {
      close,
      propertiesState,
      closeProperties,
      selectedTask,
      isFullScreen: computed(() => store.state.isFullScreen),
      isPropertiesMobileExpanded: computed(() => store.state.isPropertiesMobileExpanded)
    }
  },
  methods: {
  }
}
</script>
<template>
  <aside
    id="aside-right"
    class="bg-white dark:bg-gray-900 p-3 w-96 fixed top-0 z-40 h-screen transition-position dark:border-r dark:border-gray-800 custom-column"
    :class="[ isPropertiesMobileExpanded ? 'right-0' : '-right-96', isPropertiesMobileExpanded ? 'block' : 'hidden']"
  >
    <Icon
      :path="close.path"
      class="text-gray-600 dark:text-white float-right mt-0.5 cursor-pointer"
      :box="close.viewBox"
      :width="close.width"
      :height="close.height"
      @click="closeProperties"
    />
    <TaskProperties
      v-if="propertiesState == 'task'"
    />
    <ProjectProperties
      v-if="propertiesState == 'project'"
    />
    <ColorProperties
      v-if="propertiesState == 'color'"
    />
    <TagProperties
      v-if="propertiesState == 'tag'"
    />
    <EmployeeProperties
      v-if="propertiesState == 'employee'"
    />
    <DepartmentProperties
      v-if="propertiesState == 'department'"
    />
  </aside>
</template>
