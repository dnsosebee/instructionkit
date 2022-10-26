/* eslint-disable no-global-assign */
/* global self, onmessage, postMessage, console */
onmessage = function (e) {
  const { vars, flogram } = e.data
  const prevEntries = Object.entries(self).map(([key, value]) => [key, value])
  Object.entries(vars).forEach(([key, value]) => {
    self[key] = value
  })
  eval(flogram)
  postMessage(
    Object.entries(self).filter(v => !prevEntries.includes(v) && typeof v[1] !== 'function'),
  )
}
