module.exports = {
    apps: [
        {
            name: 'anibookquotes',
            script: 'npm',
            args: 'start',
            env_production: {
              NODE_ENV: 'production',
              PORT: 1337,
            },
            env_development: {
              NODE_ENV: 'development',
              PORT: 1338
            }
        }
    ],
};
