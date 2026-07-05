const test = require('node:test')
const assert = require('node:assert/strict')

const { createCustomRageClickDetector } = require('./custom-rage-click')

test('fires after 3 clicks on the same target within 800ms', () => {
  const target = { id: 'button' }
  const captured = []
  const detector = createCustomRageClickDetector({
    threshold: 3,
    windowMs: 800,
    onRageClick: () => captured.push('custom_rage_click'),
  })

  detector.recordClick({ target, timeStamp: 1000 })
  detector.recordClick({ target, timeStamp: 1300 })
  detector.recordClick({ target, timeStamp: 1700 })

  assert.deepEqual(captured, ['custom_rage_click'])
})

test('does not fire when clicks exceed the 800ms window', () => {
  const target = { id: 'button' }
  const captured = []
  const detector = createCustomRageClickDetector({
    threshold: 3,
    windowMs: 800,
    onRageClick: () => captured.push('custom_rage_click'),
  })

  detector.recordClick({ target, timeStamp: 1000 })
  detector.recordClick({ target, timeStamp: 1500 })
  detector.recordClick({ target, timeStamp: 1901 })

  assert.deepEqual(captured, [])
})

test('resets when the target changes', () => {
  const firstTarget = { id: 'first' }
  const secondTarget = { id: 'second' }
  const captured = []
  const detector = createCustomRageClickDetector({
    threshold: 3,
    windowMs: 800,
    onRageClick: () => captured.push('custom_rage_click'),
  })

  detector.recordClick({ target: firstTarget, timeStamp: 1000 })
  detector.recordClick({ target: firstTarget, timeStamp: 1100 })
  detector.recordClick({ target: secondTarget, timeStamp: 1200 })

  assert.deepEqual(captured, [])
})

test('clears the counter after firing once for a burst', () => {
  const target = { id: 'button' }
  const captured = []
  const detector = createCustomRageClickDetector({
    threshold: 3,
    windowMs: 800,
    onRageClick: () => captured.push('custom_rage_click'),
  })

  detector.recordClick({ target, timeStamp: 1000 })
  detector.recordClick({ target, timeStamp: 1100 })
  detector.recordClick({ target, timeStamp: 1200 })
  detector.recordClick({ target, timeStamp: 1300 })

  assert.deepEqual(captured, ['custom_rage_click'])
})
