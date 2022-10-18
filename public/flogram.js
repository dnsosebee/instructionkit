/*global console*/
/*global postMessage*/
/*global self*/

self.addEventListener('message', function (e) {
  const { varsObject, flogram } = e.data
  Object.entries(varsObject).forEach(entry => {
    self[entry[0]] = entry[1]
  })
  eval(flogram)
  self.postMessage(
    // should get all assigned global variables, including the ones that came from the varsObject, and new ones assigned in the flogram
    // code below adapted from https://stackoverflow.com/a/52693392
    Object.entries(self).filter(
      x =>
        typeof self[x[0]] !== 'function' &&
        Object.entries(Object.getOwnPropertyDescriptor(self, x[0])).filter(
          e => ['value', 'writable', 'enumerable', 'configurable'].includes(e[0]) && e[1],
        ).length === 4,
    ),
  )
})
