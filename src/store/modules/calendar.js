const state = {
  calendar: [{ key: 'today', highlight: { color: 'gray', fillMode: 'outline', class: 'back-hover' }, dates: new Date() }],
  currentDate: new Date()
}

const getters = {
}

const actions = {
  getDefaultCalendarAttributes ({ commit, state }) {
    const value = [{ key: 'today', highlight: { color: 'gray', fillMode: 'outline', class: 'back-hover' }, dates: new Date() }]
    commit('basic', { key: 'calendar', value })
  },
  setDots ({ commit, state }, dates) {
    const calendarDates = []
    for (const date of dates) {
      const splittedDate = date.split('-')
      calendarDates.push(new Date(+splittedDate[2], splittedDate[1] - 1, +splittedDate[0]))
    }
    const attr = { order: 1, dates: calendarDates, highlight: { color: 'dark', class: 'dots-back' } }
    const value = [{ key: 'today', highlight: { fillMode: 'outline', class: 'today' }, dates: new Date() }, attr]
    commit('basic', { key: 'calendar', value })
  }
}

const mutations = {
  basic (state, payload) {
    state[payload.key] = payload.value
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
