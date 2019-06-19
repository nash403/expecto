import {DEFAULT_NAMESPACE, VUEX_NOT_INSTALLED} from './constants'

export function createComponent({
  componentName,
  namespace = DEFAULT_NAMESPACE,
  className = [],
}) {
  return {
    name: componentName,
    // eslint-disable-next-line complexity
    render(h) {
      let children = null
      if (this.status) {
        children = this.$slots.spinner
      } else {
        children = this.empty ? this.$slots.empty : this.$slots.default
      }
      if (!children || !children.length) {
        return h()
      }
      return children.length === 1 ?
        children[0] :
        h('div', {class: ['expecto'].concat(className)}, children)
    },
    props: {
      when: {
        type   : [Boolean, String, Function],
        default: false,
      },
      empty: {
        type   : Boolean,
        default: false,
      },
    },
    computed: {
      isLoading() {
        const store = this.$store
        if (!store) {
          throw new Error(VUEX_NOT_INSTALLED)
        }
        return store.getters[`${namespace}/isLoading`]
      },
      anyLoading() {
        const store = this.$store
        if (!store) {
          throw new Error(VUEX_NOT_INSTALLED)
        }
        return store.getters[`${namespace}/anyLoading`]
      },
      status() {
        if (typeof this.when === 'boolean') {
          return this.when
        }
        if (this.when) {
          return this.isLoading(this.when)
        }
        return this.anyLoading
      },
    },
  }
}
