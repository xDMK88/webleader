<template>
  <div class="flex content-between w-full justify-between">
    <div class="flex font-bold m-2 text-lg">
      <slot name="block-name" />
    </div>
    <div class="flex">
      <slot name="icon" />
    </div>
  </div>
</template>
