function getPostHogConfig({ key, host, isProduction }) {
  if (!key) {
    return {
      enabled: false,
      reason: 'missing_key',
    }
  }

  if (!host) {
    return {
      enabled: false,
      reason: 'missing_host',
    }
  }

  const options = {
    api_host: host,
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
    key,
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
