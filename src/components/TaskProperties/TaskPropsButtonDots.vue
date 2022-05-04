<template>
  <Popper
    arrow
    class="light"
    placement="bottom"
  >
    <div class="mt-3 tags-custom">
      <svg
        style="width: 24px; height: 24px"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"
        />
      </svg>
    </div>
    <template #content="{ close }">
      <div
        class="flex flex-col"
        @click="close"
      >
        <div class="popper-item text-gray-400">
          Дата создания
        </div>
        <div class="popper-item text-gray-400">
          {{ dateCreateText }}
        </div>
        <div
          class="popper-item popper-clickable"
          @click="selectItem('toggleFiles')"
        >
          {{ onlyFiles ? 'Показать весь чат' : 'Показать только файлы' }}
        </div>
        <div
          class="popper-item popper-clickable"
          @click="selectItem('copyUrl')"
        >
          Копировать как ссылку
        </div>
        <div
          v-if="showDelete"
          class="popper-item popper-clickable"
          @click="selectItem('deleteTask')"
        >
          Удалить
        </div>
      </div>
    </template>
  </Popper>
</template>

<script>
import Popper from 'vue3-popper'

export default {
  components: {
    Popper
  },
  props: {
    dateCreate: {
      type: String,
      default: ''
    },
    onlyFiles: Boolean,
    showDelete: Boolean
  },
  emits: ['copyUrl', 'deleteTask', 'toggleFiles'],
  computed: {
    dateCreateText () {
      const date = new Date(this.dateCreate)
      return date.toLocaleString('default', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      })
    }
  },
  methods: {
    selectItem (value) {
      this.$emit(value)
    }
  }
}
</script>

<style scoped>
.popper-item {
  @apply flex;
  @apply items-center;
  @apply py-0.5;
  @apply px-1.5;
}
.popper-clickable {
  @apply cursor-pointer;
  @apply hover:bg-gray-100;
  @apply hover:dark:bg-stone-800;
  @apply rounded-xl;
}
.tags-custom {
  border-radius: 5px;
  background: #f4f5f7;
  padding: 4px 0px 4px 0px;
  margin: 2px 2px 2px 2px;
  position: relative;
  float: none;
  display: flex;
  cursor: pointer;
}
.tags-custom svg {
  position: relative;
  float: left;
  display: flex;
  margin-right: 5px;
  left: 3px;
  top: 0;
  color: #A6A6A6;
}
</style>
