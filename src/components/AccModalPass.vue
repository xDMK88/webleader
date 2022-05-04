<script setup>

</script>

<template>
  <fieldset>
    <form
      class="px-5"
    >
      <p>Введите старый пароль</p>
      <input
        class="bg-gray-100  rounded-xl"
        type="password"
      >
      <br>
      <p>Новый пароль</p>
      <input
        class="bg-gray-100  rounded-xl"
        type="password"
      >
      <br>
      <p>Подтвердите пароль</p>
      <input
        class="bg-gray-100  rounded-xl"
        type="password"
      >
    </form>
    <form class="mt-4 ml-5">
      <button
        type="button"
        class="bg-gray-100 hover:bg-gray-200 rounded-xl px-5 p-1"
      >
        Сохранить
      </button>
    </form>
  </fieldset>
</template>
