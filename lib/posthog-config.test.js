const test = require('node:test')
const assert = require('node:assert/strict')

const {
  getPostHogConfig,
  buildPostHogPageviewUrl,
} = require('./posthog-config')

test('returns disabled config when the key is missing', () => {
  const config = getPostHogConfig({
    key: '',
    host: 'https://post-sandbox.altras.co.uk',
    isProduction: false,
  })

  assert.deepEqual(config, {
    enabled: false,
    reason: 'missing_key',
  })
})

test('returns disabled config when the host is missing', () => {
  const config = getPostHogConfig({
    key: 'phc_example',
    host: '',
    isProduction: false,
  })

  assert.deepEqual(config, {
    enabled: false,
    reason: 'missing_host',
  })
})

test('returns enabled config with the expected PostHog options', () => {
  const config = getPostHogConfig({
    key: 'phc_example',
    host: 'https://post-sandbox.altras.co.uk',
    isProduction: true,
  })

  assert.equal(config.enabled, true)
  assert.equal(config.key, 'phc_example')
  assert.equal(config.options.api_host, 'https://post-sandbox.altras.co.uk')
  assert.equal(config.options.autocapture, true)
  assert.equal(config.options.capture_pageview, false)
  assert.equal(config.options.disable_session_recording, false)
  assert.deepEqual(config.options.rageclick, {
    content_ignorelist: false,
  })
  assert.equal(config.options.loaded, undefined)
})

test('only adds a warning hook outside production', () => {
  const productionConfig = getPostHogConfig({
    key: 'phc_example',
    host: 'https://post-sandbox.altras.co.uk',
    isProduction: true,
  })

  const developmentConfig = getPostHogConfig({
    key: 'phc_example',
    host: 'https://post-sandbox.altras.co.uk',
    isProduction: false,
  })

  assert.equal(typeof productionConfig.options.loaded, 'undefined')
  assert.equal(typeof developmentConfig.options.loaded, 'function')
})

test('builds a pageview url without a query string when there is no search', () => {
  assert.equal(buildPostHogPageviewUrl('/svg-merge', ''), '/svg-merge')
})

test('builds a pageview url with a query string when search params exist', () => {
  assert.equal(
    buildPostHogPageviewUrl('/svg-animator', 'preset=breathe'),
    '/svg-animator?preset=breathe',
  )
})
