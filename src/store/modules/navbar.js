const state = {
  navStack: ['1']
}

const getters = {
}

const actions = {
}

const mutations = {
  pushIntoNavStack: (state, navElement) => {
    state.navStack.push(navElement)
    localStorage.setItem('navStack', JSON.stringify(state.navStack))
  },
  updateStackWithInitValue: (state, navElement) => {
    state.navStack = [navElement]
    localStorage.setItem('navStack', JSON.stringify(state.navStack))
  },
  removeAllFromStackAfterIndex: (state, index) => {
    if (index === state.navStack.length - 1 || state.navStack.length === 1) {
      return
    }
    state.navStack.splice(index + 1, (state.navStack.length - 1) - index)
    localStorage.setItem('navStack', JSON.stringify(state.navStack))
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
