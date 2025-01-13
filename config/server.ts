export default ({ env }) => ({
  host: env('HOST'),
  proxy: true,
  url: env('APP_URL'),
  port: env.int('PORT'),
  app: {
    keys: env.array('APP_KEYS'),
  },
});
