function getPostHogConfig({ key, host, isProduction }) {
  const trimmedKey = key?.trim()
  const trimmedHost = host?.trim()

  if (!trimmedKey) {
    return {
      enabled: false,
      reason: 'missing_key',
    }
  }

  if (!trimmedHost) {
    return {
      enabled: false,
      reason: 'missing_host',
    }
  }

  const options = {
    api_host: trimmedHost,
    autocapture: true,
    capture_pageview: false,
    disable_session_recording: false,
    rageclick: {
      content_ignorelist: false,
    },
  }

  if (!isProduction) {
    options.loaded = (posthogInstance) => {
      posthogInstance.set_config({ debug: true })
    }
  }

  return {
    enabled: true,
    key: trimmedKey,
    options,
  }
}

function buildPostHogPageviewUrl(pathname, search) {
  if (!search) {
    return pathname
  }

  return `${pathname}?${search}`
}

module.exports = {
  getPostHogConfig,
  buildPostHogPageviewUrl,
}
