function createCustomRageClickDetector({ threshold, windowMs, onRageClick }) {
  let lastTarget = null
  let firstClickTime = 0
  let clickCount = 0

  function reset(target, timeStamp) {
    lastTarget = target
    firstClickTime = timeStamp
    clickCount = 1
  }

  function recordClick({ target, timeStamp }) {
    if (!target) {
      lastTarget = null
      firstClickTime = 0
      clickCount = 0
      return
    }

    if (target !== lastTarget || timeStamp - firstClickTime > windowMs) {
      reset(target, timeStamp)
      return
    }

    clickCount += 1

    if (clickCount >= threshold) {
      onRageClick()
      lastTarget = null
      firstClickTime = 0
      clickCount = 0
    }
  }

  return {
    recordClick,
  }
}

module.exports = {
  createCustomRageClickDetector,
}
