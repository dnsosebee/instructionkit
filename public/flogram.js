/* eslint-disable no-global-assign */
/* global self, onmessage, postMessage */
onmessage = function (e) {
  const { vars, flogram } = e.data
  const prevKeys = Object.keys(self)
  console.log('prevKeys', prevKeys)
  Object.entries(vars).forEach(([key, value]) => {
    self[key] = value
  })
  const newKeys = Object.keys(self)
  console.log('newKeys', newKeys)
  eval(flogram)
  postMessage(
    Object.entries(self).filter(
      ([key, value]) => !prevKeys.includes(key) && typeof value !== 'function',
    ),
  )
}
