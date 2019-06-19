# Expecto

> Manage your loading states (with first-class integration with Vue.js)

## Install

Wit NPM:
```
$ npm install @nashlabs/expecto
```

With Yarn:
```
$ yarn add @nashlabs/expecto
```


## Usage

With pure JS:
```js
import { expecto } from '@nashlabs/expecto'

// Start a loader (when no argument is passed, '' will be used as the default loader ID)
expecto.startLoading('someLoaderID') // now `expecto.isLoading('someLoaderID')` & `expecto.anyLoading` return `true`

// Stop a loader
expecto.stopLoading('someLoaderID')

// With a callback Expecto will automatically stop the loader
const processedResponse = await expecto.startLoading('someLoaderID', () => { // The cb must return a Promise-like object or it will throw a `TypeError`
  return fetchData().then(response => processData(response))
})
```

With pure Vue.js:
```js
import Vue from 'vue'
import Vuex from 'vuex'
import { createVuexPlugin, createVuePlugin } from '@nashlabs/expecto'


const store = new Vuex.Store({
  // ...
  plugins: [createVuexPlugin()] // this will register a new namespaced module to manage your loading states. You can pass a different namespace as first argument (default: 'loaders')
})


Vue.use(createVuePlugin({ // This needs vuex plugin to be installed
  namespace, // default: 'loaders' 
  componentName, // default: 'VWait'
  className // an array of CSS classes to apply on component (default: ['expecto'])
}))
// This will add `$isLoading`, `$anyLoading`, `$startLoading` & `$stopLoading` to `Vue.prototype`. Use `createComponent` instead if you don't want `Vue.prototype` to be poluted
```

Then in your components:
```html
// VWait Component (needs vuex plugin to be installed)
<VWait :when="/* same arguments as expecto.isLoading or directly pass true/false */" :empty="true">
  { slot content }

  <template v-slot:emtpy>
    This will be displayed <strong>in place of the default slot</strong> only if you pass `true` to the `:empty` prop.
    It can be helpful to display a 'No data' component after loading.
  </template>
</VWait>
```

This is what you need to know about the module that is registered in the store when you call `createVuexPlugin`
```js
store.registerModule(namespace, {
  // ...
  getters: {
    isLoading : state => ..., // same thing as calling expecto.isLoading(...)
    anyLoading: state => ..., // same thing as calling expecto.anyLoading
  },
  actions: {
    startLoading: ({commit}, { loaderId, callback }) => ..., // same thing as calling expecto.startLoading(loaderId, callback)
    stopLoading: ({commit}, { loaderId }) => ..., // same thing as calling expecto.stopLoading(loaderId)
  },
  // ...
})
```



## Tips

### **Tip 1:** `isLoading` can take a function as an argument instead of a loaderId.

In that case, it will behave exactly like the function argument passed to `Array.prototype.findIndex`. Each currently loading loaderId is be passed to the function until it returns true and the loop stops. `isLoading` will return true only if the function returned true for at least one id. 

```js
expecto.isLoading(id => /^UID-.*/.test) // returns `true` if one id starts with 'UID-'
```

### **Tip 2:** Need to call vuex manually ?

```js
$store.dispatch(`<vuex module name>/startLoading`, { loaderId, callback }, { root: true })
```

### **Tip 3:** The class used under the hood (`ExpectoWrapper`) is also exposed.

By creating new instances of it, you can have different and isolated loading state managers.

```js
$store.dispatch(`<vuex module name>/startLoading`, { loaderId, callback }, { root: true })
```

## License

MIT © [Honoré Nintunze](https://nintu.me)