<template>
  <li class="node-tree">
    <span class="label">{{ node.name }}</span>
    <ul v-if="node.children">
      <node
        v-for="child in node.children"
        :key="child"
        :node="child"
      />
    </ul>
  </li>
</template>

<script>
export default {
  name: 'Node',
  props: {
    node: Object
  }
}
</script>
