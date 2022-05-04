<script setup>

import { computed } from 'vue'
import { useStore } from 'vuex'

const localization = computed(() => store.state.localization.localization)

const store = useStore()
const user = computed(() => store.state.user.user)

</script>
<template>
  <form class="px-5 text-lg">
    <br>
    <strong>{{ localization.owner_license }}</strong>
    <br>
    <span>{{ user.owner_title }}</span>
    <br>
    <br>
    <strong>Почта владельца лицензии</strong>
    <br>
    <span>{{ user.owner_email }}</span>
    <br>
    <br>
    <strong>Количество рабочих мест</strong>
    <br>
    <span>-</span>
    <br>
    <br>
    <strong>Занято места на сервере</strong>
    <br>
    <span>{{ user.total_mb }} {{ localization.megabytes }} ({{ user.percent_mb }}%)</span>
    <br>
    <br>
    <strong>Последняя синхронизация</strong>
    <br>
    <span>синхронизация</span>
    <br>
  </form>
  <form
    class="text-center text-lg"
    action="https://www.leadertask.ru/market"
  >
    <button
      type="submit"
      class="bg-gray-100 hover:bg-gray-200 rounded-xl px-6 p-1"
    >
      Продлить лицензию
    </button>
  </form>
</template>
