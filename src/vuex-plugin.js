import {DEFAULT_NAMESPACE} from './constants'
import {ExpectoWrapper} from './expecto'

export const createVuexPlugin = (namespace = DEFAULT_NAMESPACE) => {
  return function installVuexPlugin(store) {
    const expecto = new ExpectoWrapper()

    const mutationTypes = {
      START_LOADER: 'START_LOADER',
      STOP_LOADER : 'STOP_LOADER',
    }

    store.registerModule(namespace, {
      namespaced: true,
      state     : {
        expecto,
      },
      getters: {
        isLoading : state => state.expecto.isLoading,
        anyLoading: state => state.expecto.anyLoading,
      },
      actions: {
        startLoading: ({commit}, payload) =>
          commit(mutationTypes.START_LOADER, payload),
        stopLoading: ({commit}, payload) =>
          commit(mutationTypes.STOP_LOADER, payload),
      },
      mutations: {
        [mutationTypes.START_LOADER](state, {loaderId, callback}) {
          return state.expecto.startLoading(loaderId, callback)
        },
        [mutationTypes.STOP_LOADER](state, {loaderId}) {
          state.expecto.stopLoading(loaderId)
        },
      },
    })

    return expecto
  }
}
