module.exports = {
  apps: [{
    name: 'nuxt-backoffice',
    script: '.output/server/index.mjs',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
      HOST: '127.0.0.1'
    }
  }]
}
