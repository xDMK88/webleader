<script setup>
import AsideNavigatorItem from '@/components/AsideNavigatorItem.vue'

defineProps({
  isSubmenuList: {
    type: Boolean,
    default: false
  },
  menu: {
    type: Object,
    default: () => {}
  }
})

const emit = defineEmits(['menu-click'])

const menuClick = (event, item) => {
  emit('menu-click', event, item)
}
</script>

<template>
  <p
    v-if="menu.name"
    class="p-3 text-xs uppercase text-gray-400"
  >
    {{ menu.name }}
  </p>
  <ul>
    <aside-navigator-item
      v-for="item in menu.items"
      :key="item.uid"
      :item="item"
      :is-submenu-list="isSubmenuList"
      @menu-click="menuClick"
    />
  </ul>
</template>
