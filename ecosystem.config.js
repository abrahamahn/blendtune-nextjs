module.exports = {
    apps: [
      {
        name: "blendtune",
        cwd: "/var/www/blendtune",
        script: "pnpm",
        args: "start",
        env: {
          NODE_ENV: "production",
          PORT: 3000
        }
      }
    ]
  };
