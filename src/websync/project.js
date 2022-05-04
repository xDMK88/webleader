import store from '@/store/index.js'

export function createProject (obj) {
  store.commit('NAVIGATOR_PUSH_PROJECT', [obj.obj])
}

export function removeProject (obj) {
  store.commit('NAVIGATOR_REMOVE_PROJECT', { uid_parent: '', uid: obj.uid })
}

export function updateProject (obj) {
  store.commit('NAVIGATOR_UPDATE_PROJECT', obj.obj)
}
