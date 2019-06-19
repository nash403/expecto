export const uniq = array => {
  return array.filter((el, index, arr) => index === arr.indexOf(el))
}

export const isLoading = ctx => (loaderId = '') => {
  if (typeof loaderId === 'function') {
    return ctx.loaders.findIndex(loaderId) > -1
  } else {
    return ctx.loaders.indexOf(loaderId) > -1
  }
}

export const anyLoading = ctx => ctx.loaders.length > 0

export const startLoading = ctx => (loaderId = '') => {
  ctx.loaders.push(loaderId)
  ctx.loaders = uniq(ctx.loaders)
}

export const stopLoading = ctx => (loaderId = '') => {
  ctx.loaders = uniq(ctx.loaders).filter(id => id !== loaderId)
}
