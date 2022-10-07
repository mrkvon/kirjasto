const config = {
  api: {
    proxy: process.env.REACT_APP_API_PROXY ?? 'http://localhost:3001/?uri=',
    isProxyEncoded: Boolean(process.env.REACT_APP_API_PROXY_ENCODED) ?? false,
  },
}

export default config
