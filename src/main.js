import { createApp } from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import store from './store'
import Notifications from 'notiwind'

import './css/main.css'

console.log(process.env)

const token = localStorage.getItem('user-token')
const navStack = JSON.parse(localStorage.getItem('navStack'))
const isGridView = JSON.parse(localStorage.getItem('isGridView'))

function pad2 (n) {
  return (n < 10 ? '0' : '') + n
}

const chosenDate = new Date()
const month = pad2(chosenDate.getMonth() + 1)
const day = pad2(chosenDate.getDate())
const year = chosenDate.getFullYear()
const formattedDate = day + '-' + month + '-' + year
axios.defaults.headers.common.LocalDate = formattedDate

if (token) {
  axios.defaults.headers.common.Authorization = token
}

store.commit('basic', { key: 'isGridView', value: isGridView })

if (navStack) {
  for (const navElem of navStack) {
    store.commit('pushIntoNavStack', navElem)
  }
}

/* Default title tag */
const defaultDocumentTitle = 'Leadertask 2.0'

/* Collapse mobile aside menu on route change */
router.beforeEach((to) => {
  store.dispatch('asideMobileToggle', false)
  store.dispatch('asideLgToggle', false)
})

router.afterEach((to) => {
  /* Set document title from route meta */
  if (to.meta && to.meta.title) {
    document.title = `${to.meta.title} — ${defaultDocumentTitle}`
  } else {
    document.title = defaultDocumentTitle
  }

  /* Full screen mode */
  store.dispatch('fullScreenToggle', !!to.meta.fullScreen)
})

createApp(App).use(store).use(router).use(Notifications).mount('#app')
