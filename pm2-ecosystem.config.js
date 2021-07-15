module.exports = {
  apps: [
    {
      name: "cowin-verify-api",
      script: "dist/index.js",
      env: {
        NODE_ENV: "development"
      },
      env_development: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
