import {DEFAULT_NAMESPACE, DEFAULT_COMPONENT_NAME} from './constants'
import {createComponent} from './component'

export function createVuePlugin({
  namespace = DEFAULT_NAMESPACE,
  componentName = DEFAULT_COMPONENT_NAME,
  className,
} = {}) {
  const install = Vue => {
    Vue.prototype.$startLoading = function $startLoading(loaderId, callback) {
      return this.$store.dispatch(
        `${namespace}/startLoading`,
        {loaderId, callback},
        {root: true}
      )
    }
    Vue.prototype.$stopLoading = function $stopLoading(loaderId) {
      this.$store.dispatch(
        `${namespace}/stopLoading`,
        {loaderId},
        {root: true}
      )
    }
    Vue.prototype.$isLoading = function $isLoading(loaderId) {
      return this.$store.getters[`${namespace}/isLoading`](loaderId)
    }
    Vue.prototype.$anyLoading = function $anyLoading() {
      return this.$store.getters[`${namespace}/anyLoading`]
    }
    Vue.component(
      componentName,
      createComponent({componentName, namespace, className})
    )
  }
  return install
}
