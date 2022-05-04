import {
  MESSAGES_REQUEST,
  CREATE_MESSAGE_REQUEST,
  DELETE_MESSAGE_REQUEST,
  MESSAGES_ERROR,
  MESSAGES_SUCCESS,
  REFRESH_MESSAGES
} from '../actions/taskmessages'
import {
  FILES_REQUEST,
  FILES_ERROR,
  FILES_SUCCESS,
  REFRESH_FILES,
  MYFILES,
  GETFILES,
  FILE_SUCCESS,
  CREATE_FILE_REQUEST,
  CREATE_FILES_REQUEST,
  MERGE_FILES_WITH_MESSAGES,
  TOGGLE_UPLOAD_STATUS
} from '../actions/taskfiles'
import { AUTH_LOGOUT } from '../actions/auth'
import { notify } from 'notiwind'

import axios from 'axios'

const state = {
  /* messages */
  messages: [],
  status: '',
  hasLoadedOnce: false,
  /* files */
  files: [],
  file: '',
  myfiles: {},
  uploadStarted: false
}

const getters = {}

const actions = {
  [FILES_REQUEST]: ({ commit, dispatch }, taskUid) => {
    return new Promise((resolve, reject) => {
      commit(FILES_REQUEST)
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/tasksfiles/bytask?uid=' + taskUid
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(FILES_SUCCESS, resp)
          resolve(resp)
        }).catch(err => {
          commit(FILES_ERROR)
          reject(err)
        })
    })
  },
  //  GetFiles
  [GETFILES]: ({ commit, dispatch }, uid) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/tasksfiles/file?uid=' + uid
      axios({ url: url, method: 'GET', responseType: 'blob' })
        .then(resp => {
          commit(FILE_SUCCESS, resp)
          resolve(resp)
        }).catch(err => {
          commit(FILES_ERROR)
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: GETFILES,
            text: err.response.data
          }, 15000)
          // Don't log out
          // dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [CREATE_FILES_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/tasksfiles/several?uid_task=' + data.uid_task
      commit(TOGGLE_UPLOAD_STATUS)
      console.log(data)
      axios({
        url: url,
        method: 'POST',
        data: data.name,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(resp => {
          commit(CREATE_FILES_REQUEST, resp)
          commit(TOGGLE_UPLOAD_STATUS)
          resolve(resp)
        }).catch(err => {
          reject(err)
          commit(TOGGLE_UPLOAD_STATUS)
        })
    })
  },
  [CREATE_FILE_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/tasksfiles/one?uid_task=' + data.uid_task
      axios({
        url: url,
        method: 'POST',
        data: data.name,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(resp => {
          commit(CREATE_FILE_REQUEST, data)
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
    })
  },
  [MESSAGES_REQUEST]: ({ commit, dispatch }, taskUid) => {
    return new Promise((resolve, reject) => {
      commit(MESSAGES_REQUEST)
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/tasksmsgs/bytask?uid=' + taskUid
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(MESSAGES_SUCCESS, resp)
          resolve(resp)
        }).catch(err => {
          commit(MESSAGES_ERROR, err)
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: MESSAGES_REQUEST,
            text: err.response.data
          }, 15000)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [CREATE_MESSAGE_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      commit(MESSAGES_REQUEST)
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/tasksmsgs'
      axios({ url: url, method: 'POST', data: data })
        .then(resp => {
          resolve(resp)
          commit(CREATE_MESSAGE_REQUEST, data)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: CREATE_MESSAGE_REQUEST,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  },
  [DELETE_MESSAGE_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      commit(MESSAGES_REQUEST)
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/tasksmsgs?uid=' + data.uid
      axios({ url: url, method: 'DELETE' })
        .then(resp => {
          resolve(resp)
          commit(DELETE_MESSAGE_REQUEST, data)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: DELETE_MESSAGE_REQUEST,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  },
  fetchMessagesAndFiles ({ commit, dispatch }, uid) {
    commit(MESSAGES_REQUEST)

    const messages = dispatch(MESSAGES_REQUEST, uid)
    const files = dispatch(FILES_REQUEST, uid)

    return Promise.all([messages, files])
      .then(() => {
        commit(MERGE_FILES_WITH_MESSAGES)
      })
  }
}

const mutations = {
  [MESSAGES_REQUEST]: state => {
    state.status = 'loading'
  },
  [MESSAGES_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.messages = resp.data.msgs
    state.hasLoadedOnce = true
  },
  [MESSAGES_ERROR]: state => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  [REFRESH_MESSAGES]: state => {
    state.messages = []
  },
  [CREATE_MESSAGE_REQUEST]: (state, data) => {
    state.messages.push(data)
  },
  [FILES_REQUEST]: state => {
    state.status = 'loading'
  },
  [FILES_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.files = resp.data.files
    state.hasLoadedOnce = true
  },
  [FILE_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.file = resp.data.files
    state.hasLoadedOnce = true
  },
  [CREATE_FILE_REQUEST]: (state, resp) => {
    state.status = 'success'
    state.hasLoadedOnce = true
  },
  createLoadingFile (state, data) {
    data.loading = true
    state.messages.push(data)
  },
  [CREATE_FILES_REQUEST]: (state, resp) => {
    state.status = 'success'
    state.hasLoadedOnce = true
    for (let i = 0; i < state.messages.length; i++) {
      state.messages = state.messages.filter(item => !item.loading)
    }
    for (const file of resp.data.success) {
      file.msg = file.file_name
      state.messages.push(file)
    }
    console.log('create fileS request', resp)
  },
  [MYFILES]: (state, myfiles) => {
    state.status = 'success'
    for (const taskfile of myfiles) {
      state.myfiles[taskfile.uid_creator] = taskfile
    }
    state.hasLoadedOnce = true
  },
  [FILES_ERROR]: state => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  [REFRESH_FILES]: state => {
    state.files = []
  },
  [MERGE_FILES_WITH_MESSAGES]: state => {
    state.files.forEach(item => {
      item.msg = item.file_name
    })
    state.messages = state.messages.concat(state.files)
    state.messages.sort((a, b) => {
      return new Date(a.date_create) - new Date(b.date_create)
    })
  },
  [TOGGLE_UPLOAD_STATUS]: state => {
    state.uploadStarted = !state.uploadStarted
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
