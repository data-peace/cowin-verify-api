module.exports = {
    apps:[
        {
            name    : "cowin-verify-api",
            script  : "dist/index.js",
            env: {
                PORT: 8080
            },
            env_production: {
                NODE_ENV: "production",
            },
            env_development: {
                NODE_ENV: "development",
                PORT: 8000
            }
        }
    ]
};
