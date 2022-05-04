import {
  SELECT_DEPARTMENT,
  PUSH_DEPARTMENT,
  CREATE_DEPARTMENT_REQUEST,
  UPDATE_DEPARTMENT_REQUEST,
  REMOVE_DEPARTMENT_REQUEST
} from '../actions/departments'
import axios from 'axios'
import { notify } from 'notiwind'

const state = {
  deps: {},
  selectedDepartment: null
}

const getters = {
}

const actions = {
  [CREATE_DEPARTMENT_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/dep'
      axios({ url: url, method: 'POST', data: data })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: CREATE_DEPARTMENT_REQUEST,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  },
  [UPDATE_DEPARTMENT_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/dep'
      axios({ url: url, method: 'PATCH', data: data })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: UPDATE_DEPARTMENT_REQUEST,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  },
  [REMOVE_DEPARTMENT_REQUEST]: ({ commit, dispatch }, uid) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/dep?uid=' + uid
      axios({ url: url, method: 'DELETE' })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: REMOVE_DEPARTMENT_REQUEST,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  }
}

const mutations = {
  [PUSH_DEPARTMENT]: (state, department) => {
    state.deps[department.uid] = department
  },
  [SELECT_DEPARTMENT]: (state, department) => {
    state.selectedDepartment = department
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
