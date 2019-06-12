import base from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    name: 'v-expecto',
    file: 'dist/v-expecto.esm.js',
    format: 'es',
  },
  external: [],
})

export default config
