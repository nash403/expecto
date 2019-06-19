import base from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    name  : 'expecto',
    file  : 'dist/expecto.esm.js',
    format: 'es',
  },
  external: [],
})

export default config
