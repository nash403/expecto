(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.expecto = {}));
}(this, function (exports) { 'use strict';

  const uniq = array => {
    return array.filter((el, index, arr) => index === arr.indexOf(el));
  };
  const isLoading = ctx => (loaderId = '') => {
    if (typeof loaderId === 'function') {
      return ctx.loaders.findIndex(loaderId) > -1;
    } else {
      return ctx.loaders.indexOf(loaderId) > -1;
    }
  };
  const anyLoading = ctx => ctx.loaders.length > 0;
  const startLoading = ctx => (loaderId = '') => {
    ctx.loaders.push(loaderId);
    ctx.loaders = uniq(ctx.loaders);
  };
  const stopLoading = ctx => (loaderId = '') => {
    ctx.loaders = uniq(ctx.loaders).filter(id => id !== loaderId);
  };

  class ExpectoWrapper {
    constructor() {
      this.loaders = [];
    }

    get isLoading() {
      return isLoading(this);
    }

    get anyLoading() {
      return anyLoading(this);
    }

    startLoading(loaderId = '', callback) {
      startLoading(this)(loaderId);

      if (!callback) {
        return undefined;
      }

      return new Promise((resolve, reject) => {
        callback().then(resolve, reject).finally(() => this.stopLoading(loaderId));
      });
    }

    stopLoading(loaderId = '') {
      stopLoading(this)(loaderId);
    }

  }

  const VUEX_NOT_INSTALLED = 'Vuex not initialized.';
  const DEFAULT_NAMESPACE = 'loaders';
  const DEFAULT_COMPONENT_NAME = 'VWait';

  const createVuexPlugin = (namespace = DEFAULT_NAMESPACE) => {
    return function installVuexPlugin(store) {
      const expecto = new ExpectoWrapper();
      const mutationTypes = {
        START_LOADER: 'START_LOADER',
        STOP_LOADER: 'STOP_LOADER'
      };
      store.registerModule(namespace, {
        namespaced: true,
        state: {
          expecto
        },
        getters: {
          isLoading: state => state.expecto.isLoading,
          anyLoading: state => state.expecto.anyLoading
        },
        actions: {
          startLoading: ({
            commit
          }, payload) => commit(mutationTypes.START_LOADER, payload),
          stopLoading: ({
            commit
          }, payload) => commit(mutationTypes.STOP_LOADER, payload)
        },
        mutations: {
          [mutationTypes.START_LOADER](state, {
            loaderId,
            callback
          }) {
            return state.expecto.startLoading(loaderId, callback);
          },

          [mutationTypes.STOP_LOADER](state, {
            loaderId
          }) {
            state.expecto.stopLoading(loaderId);
          }

        }
      });
      return expecto;
    };
  };

  function createComponent({
    componentName = DEFAULT_COMPONENT_NAME,
    namespace = DEFAULT_NAMESPACE,
    className = []
  }) {
    return {
      name: componentName,

      // eslint-disable-next-line complexity
      render(h) {
        let children = null;

        if (this.status) {
          children = this.$slots.spinner;
        } else {
          children = this.empty ? this.$slots.empty : this.$slots.default;
        }

        if (!children || !children.length) {
          return h();
        }

        return children.length === 1 ? children[0] : h('div', {
          class: ['expecto'].concat(className)
        }, children);
      },

      props: {
        when: {
          type: [Boolean, String, Function],
          default: false
        },
        empty: {
          type: Boolean,
          default: false
        }
      },
      computed: {
        isLoading() {
          const store = this.$store;

          if (!store) {
            throw new Error(VUEX_NOT_INSTALLED);
          }

          return store.getters[`${namespace}/isLoading`];
        },

        anyLoading() {
          const store = this.$store;

          if (!store) {
            throw new Error(VUEX_NOT_INSTALLED);
          }

          return store.getters[`${namespace}/anyLoading`];
        },

        status() {
          if (typeof this.when === 'boolean') {
            return this.when;
          }

          if (this.when) {
            return this.isLoading(this.when);
          }

          return this.anyLoading;
        }

      }
    };
  }

  function createVuePlugin({
    namespace = DEFAULT_NAMESPACE,
    componentName = DEFAULT_COMPONENT_NAME,
    className
  } = {}) {
    const install = Vue => {
      Vue.prototype.$startLoading = function $startLoading(loaderId, callback) {
        return this.$store.dispatch(`${namespace}/startLoading`, {
          loaderId,
          callback
        }, {
          root: true
        });
      };

      Vue.prototype.$stopLoading = function $stopLoading(loaderId) {
        this.$store.dispatch(`${namespace}/stopLoading`, {
          loaderId
        }, {
          root: true
        });
      };

      Vue.prototype.$isLoading = function $isLoading(loaderId) {
        return this.$store.getters[`${namespace}/isLoading`](loaderId);
      };

      Vue.prototype.$anyLoading = function $anyLoading() {
        return this.$store.getters[`${namespace}/anyLoading`];
      };

      Vue.component(componentName, createComponent({
        componentName,
        namespace,
        className
      }));
    };

    return install;
  }

  const expecto = new ExpectoWrapper();

  exports.DEFAULT_NAMESPACE = DEFAULT_NAMESPACE;
  exports.ExpectoWrapper = ExpectoWrapper;
  exports.createComponent = createComponent;
  exports.createVuePlugin = createVuePlugin;
  exports.createVuexPlugin = createVuexPlugin;
  exports.expecto = expecto;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
