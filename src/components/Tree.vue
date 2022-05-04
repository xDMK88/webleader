<template>
  <div class="tree">
    <ul class="tree-list">
      <node-tree
        :node="treeData"
        @click="toggle"
      />
    </ul>
  </div>
</template>

<script>
import NodeTree from '@/components/NodeTree.vue'

export default {
  components: {
    NodeTree
  },
  props: {
    treeData: Object
  }
}
</script>

<style>
.tree-list ul {
  margin: 6px 0;
  padding-left: 16px;
}
</style>
