import store from '@/store/index.js'
import { notify } from 'notiwind'
import { computed } from 'vue'

function showNotify (notification) {
  notify(notification, 30000)
  const nt = new Audio(require('@/assets/sounds/notification.mp3'))
  nt.volume = 0.5
  nt.play()
}

const user = computed(() => store.state.user.user)

export default function initInspectorSocket () {
  const socket = new WebSocket(process.env.VUE_APP_INSPECTOR_WS)
  socket.onopen = function (event) {
    const auth = { type: 'auth', message: user.value.current_user_uid }
    socket.send(JSON.stringify(auth))
  }
  socket.onmessage = function (event) {
    parseMessage(event.data)
  }
  socket.onclose = function (event) {
    setTimeout(function () {
      initInspectorSocket()
    }, 2500)
  }
  socket.onerror = function () {
    socket.close()
  }
}

function parseMessage (data) {
  try {
    const parsedData = JSON.parse(data)
    showNotify({ group: 'top', title: 'Инспектор', text: parsedData.message })
  } catch (e) {
    console.log(e)
  }
}
