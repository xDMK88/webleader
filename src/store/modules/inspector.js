import * as INSPECTOR from '../actions/inspector'
import axios from 'axios'
import { notify } from 'notiwind'

const state = {
}

const getters = {
}

const actions = {
  [INSPECTOR.CREATE_INSPECTOR_TASK]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'inspecttask'
      axios({ url: url, method: 'POST', data: data })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'INSPECTOR API Error, please make screenshot',
            action: INSPECTOR.CREATE_INSPECTOR_TASK,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  }
}

const mutations = {
}

export default {
  state,
  getters,
  actions,
  mutations
}
