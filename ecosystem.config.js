module.exports = {
  apps: [{
    name: 'blendtune',
    script: 'yarn',
    args: 'start',
    interpreter: '/bin/bash',
    env: {
      NODE_ENV: 'production',
    },
  }],
};
