<template>
  <div
    class="tag-label cursor-default p-1 px-2 text-xs whitespace-nowrap rounded-lg mr-1 flex items-center"
    :class="[colorTextClass, colorBgClass]"
    :style="colorBgStyle"
  >
    <Icon
      v-if="iconPath"
      :path="iconPath"
      class="mr-1"
      :class="[colorTextClass]"
      :box="iconBox"
      :width="iconWidth"
      :height="iconHeight"
    />
    {{ text }}
  </div>
</template>

<script>
import Icon from '@/components/Icon.vue'

export default {
  components: {
    Icon
  },
  props: {
    colorTextClass: {
      type: String,
      default: 'text-white'
    },
    colorBgClass: {
      type: String,
      default: ''
    },
    colorBgStyle: {
      type: Object,
      default: () => ({})
    },
    iconPath: {
      type: [String, Array],
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    iconBox: {
      type: String,
      default: '0 0 13 12'
    },
    iconWidth: {
      type: String,
      default: '13'
    },
    iconHeight: {
      type: String,
      default: '12'
    }
  }
}
</script>

<style scoped></style>
