import store from '@/store/index.js'

export function createTask (obj) {
  store.commit('ADD_TASK', obj.obj)
}

export function removeTask (uid) {
  store.commit('REMOVE_TASK', uid)
}

export function updateTask (obj) {
  store.commit('UPDATE_TASK', obj.obj)
}
