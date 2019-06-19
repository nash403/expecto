import test from 'ava'
import {ExpectoWrapper} from '../src/expecto'

// Macros
function loaderHasStarted(t, id = '') {
  // Given
  const expecto = new ExpectoWrapper()

  // When
  expecto.startLoading(id)

  // Then
  t.true(expecto.isLoading(id))
  t.true(expecto.anyLoading)

  return expecto
}

loaderHasStarted.title = (providedTitle = '', id) =>
  `${providedTitle} [w/ "${id}" as loader ID]`.trim()

function loaderHasStartedAndStopped(t, id = '') {
  const expecto = loaderHasStarted(t, id)

  // When
  expecto.stopLoading(id)

  // Then
  t.false(expecto.isLoading(id))
  t.false(expecto.anyLoading)
}

loaderHasStartedAndStopped.title = (providedTitle = '', id) =>
  `${providedTitle} [w/ "${id}" as loader ID]`.trim()

function matchMultiple(t, rangeSize, idsToMatch, expected) {
  const expecto = new ExpectoWrapper()
  // When
  const ids = [...Array(rangeSize).keys()]
  ids.forEach(id => expecto.startLoading(id))

  // Then
  t.true(expecto.anyLoading)
  let matchingNb = 0
  t.is(
    expecto.isLoading(id => {
      return idsToMatch.includes(id) && ++matchingNb === idsToMatch.length
    }),
    expected
  )
}

matchMultiple.title = (providedTitle = '', rangeSize, idsToMatch, expected) => {
  return `${providedTitle} [expected ${
    expected ? '' : 'not '
  }to find all loaders]`.trim()
}

// Tests
test('ExpectoWrapper has correct defaults at creation', t => {
  // Given
  const expecto = new ExpectoWrapper()

  // Then
  t.false(expecto.anyLoading)
  t.false(expecto.isLoading())
})

test(
  `startLoading with no params starts a default loader with an empty name and it's actually loading`,
  loaderHasStarted
)

test(
  `startLoading with a loader ID starts a loader with that ID and it's actually loading`,
  loaderHasStarted,
  'someID'
)

test(`stopLoading stops specified loader`, loaderHasStartedAndStopped, 'someID')

test(`all started IDs are loading`, t => {
  // Given
  const expecto = new ExpectoWrapper()

  // When
  const ids = [...Array(10).keys()]
  ids.forEach(id => expecto.startLoading(id))

  // Then
  t.true(expecto.anyLoading)
  t.true(ids.every(expecto.isLoading))
})

test(`isLoading using a pattern function to match at least one loader among all started IDs`, t => {
  // Given
  const expecto = new ExpectoWrapper()
  const nbIds = 10

  // When
  const ids = [...Array(nbIds).keys()]
  ids.forEach(id => expecto.startLoading(id))

  // Then
  t.true(expecto.anyLoading)
  t.true(expecto.isLoading(id => id < nbIds))
  t.false(expecto.isLoading(id => id >= nbIds))
})

test(
  `isLoading using a pattern function to match multiple loaders among all started IDs: all IDs are loading`,
  matchMultiple,
  10,
  [0, 1, 2],
  true
)

test(
  `isLoading using a pattern function to match multiple loaders among all started IDs: one ID isn't loading`,
  matchMultiple,
  10,
  [0, 12, 2],
  false
)

test('startLoading with a callback that resolves automatically stops', t => {
  // Given
  const expecto = new ExpectoWrapper()
  const returnedData = 'some data'

  // When
  return expecto.startLoading('', () => {
    return Promise.resolve(returnedData)
  })
    .then(result => {
      // Then
      t.is(result, returnedData)
    })
    .finally(() => {
      t.false(expecto.anyLoading)
    })

  // I don't know why but when I write the same test in the following way it doesn't work...
  // let result
  // try {
  //   result = await expecto.startLoading('', () => {
  //     return Promise.resolve(returnedData)
  //   })
  // } catch (e) {
  //   // Then
  //   t.fail()
  // } finally {
  //   // Then
  //   t.is(result, returnedData)
  //   t.false(expecto.anyLoading)
  // }

})

test('startLoading with a callback that rejects automatically stops', t => {
  // Given
  const expecto = new ExpectoWrapper()
  const errorMsg = 'some error msg'

  // When
  return expecto.startLoading('', () => {
    return Promise.reject(new Error(errorMsg))
  })
    .catch(err => {
      // Then
      t.is(err.message, errorMsg)
    })
    .finally(() => {
      t.false(expecto.anyLoading)
    })
})

test('startLoading with a callback that does not return a Promise throws', async t => {
  // Given
  const expecto = new ExpectoWrapper()

  // When
  try {
    await expecto.startLoading('', () => {
      return 'something'
    })
  } catch (e) {
    // Then
    t.true(e instanceof TypeError)
    t.true(expecto.anyLoading)
  }
})

test.only('in startLoading, there is a loader during callback execution', t => {
  // Given
  const expecto = new ExpectoWrapper()
  const returnedData = 'some data'

  // When
  return expecto.startLoading('', () => {
    t.true(expecto.anyLoading)
    return Promise.resolve(returnedData)
  })

})
