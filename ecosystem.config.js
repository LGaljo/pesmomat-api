// PM2 config file to set up processes

module.exports = {
  apps: [
    {
      name: "Pesmomat API",
      script: "cd pesmomat-api && node dist/main",
      watch: false,
      env: {
        "NODE_ENV": "production"
      },
      env_production: {
        "NODE_ENV": "production"
      }
    },
    {
      name: "Pesmomat APP",
      script: "cd pesmomat-app && npm run start:rpi",
      watch: false,
      env: {
        "NODE_ENV": "production"
      },
      env_production: {
        "NODE_ENV": "production"
      }
    },
    {
      name: "Browser",
      script: "sleep 15 & chromium-browser --kiosk --incognito --disable-pinch --overscroll-history-navigation=0 http://localhost:3000"
    }
  ]
};