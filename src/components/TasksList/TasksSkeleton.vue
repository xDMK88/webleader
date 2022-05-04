<template>
  <div class="animate-pulse flex pr-4 mt-0.5">
    <div class="flex-col w-full">
      <div :class="['h-20', classes, classesDark]" />
      <div :class="['h-20', classes, classesDark]" />
      <div :class="['h-10', classes, classesDark]" />
      <div :class="['h-20', classes, classesDark]" />
      <div :class="['h-40', classes, classesDark]" />
      <div :class="['h-20', classes, classesDark]" />
      <div :class="['h-20', classes, classesDark]" />
      <div :class="['h-20', classes, classesDark]" />
      <div :class="['h-10', classes, classesDark]" />
      <div :class="['h-10', classes, classesDark]" />
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    classes: 'animate-pulse bg-white my-1 border border-gray-300 rounded-xl',
    classesDark: 'dark:bg-slate-900 dark:border-gray-700'
  })
}
</script>
