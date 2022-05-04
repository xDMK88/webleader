import {
  PUSH_EMPLOYEE,
  PUSH_EMPLOYEE_BY_EMAIL,
  SELECT_EMPLOYEE,
  CREATE_EMPLOYEE_REQUEST,
  UPDATE_EMPLOYEE_REQUEST,
  REMOVE_EMPLOYEE_REQUEST
} from '../actions/employees'
import axios from 'axios'
import { notify } from 'notiwind'

const state = {
  employees: {},
  employeesByEmail: {},
  selectedEmployee: null
}

const getters = {
}

const actions = {
  [CREATE_EMPLOYEE_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/emp'
      axios({ url: url, method: 'POST', data: data })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: CREATE_EMPLOYEE_REQUEST,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  },
  [UPDATE_EMPLOYEE_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/emp/title/?email=' + data.email + '&title=' + data.name
      axios({ url: url, method: 'PATCH' })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: UPDATE_EMPLOYEE_REQUEST,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  },
  [REMOVE_EMPLOYEE_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/emp?uid_delete=' + data.uid + '&uid_delegate=00000000-0000-0000-0000-000000000000'
      axios({ url: url, method: 'DELETE' })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: REMOVE_EMPLOYEE_REQUEST,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  }
}

const mutations = {
  [PUSH_EMPLOYEE]: (state, employee) => {
    state.employees[employee.uid] = employee
  },
  [PUSH_EMPLOYEE_BY_EMAIL]: (state, employee) => {
    state.employeesByEmail[employee.email.toLowerCase()] = employee
  },
  [SELECT_EMPLOYEE]: (state, employee) => {
    state.selectedEmployee = employee
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
