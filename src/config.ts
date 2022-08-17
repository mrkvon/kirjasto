const config = {
  api: {
    proxy: process.env.REACT_APP_API_PROXY ?? 'http://localhost:3001/?uri=',
  },
}

export default config
