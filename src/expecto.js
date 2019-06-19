import {isLoading, anyLoading, startLoading, stopLoading} from './utils'

export class ExpectoWrapper {
  constructor() {
    this.loaders = []
  }

  get isLoading() {
    return isLoading(this)
  }

  get anyLoading() {
    return anyLoading(this)
  }

  startLoading(loaderId = '', callback) {
    startLoading(this)(loaderId)
    if (!callback) {
      return undefined
    }
    return new Promise((resolve, reject) => {
      callback()
        .then(resolve, reject)
        .finally(() => this.stopLoading(loaderId))
    })
  }

  stopLoading(loaderId = '') {
    stopLoading(this)(loaderId)
  }
}
