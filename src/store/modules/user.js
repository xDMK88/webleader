import axios from 'axios'
import { notify } from 'notiwind'
import { USER_ERROR, USER_REQUEST, USER_SUCCESS } from '../actions/user'

const state = {
  user: false,
  status: '',
  hasLoadedOnce: false
}

const getters = {}

const actions = {
  [USER_REQUEST]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      commit(USER_REQUEST)
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/account/info'
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          commit(USER_SUCCESS, resp)
          resolve(resp)
        })
        .catch((err) => {
          notify(
            {
              group: 'api',
              title: 'REST API Error, please make screenshot',
              action: USER_REQUEST,
              text: err.response.data
            },
            15000
          )
          commit(USER_ERROR, err)
          reject(err)
        })
    })
  }
}

const mutations = {
  [USER_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [USER_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.user = resp.data
    console.log('current user', state.user)
    state.hasLoadedOnce = true
  },
  [USER_ERROR]: (state) => {
    state.status = 'error'
    state.hasLoadedOnce = true
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
