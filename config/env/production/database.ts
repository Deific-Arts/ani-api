export default ({ env }) => {
  const client = env('DATABASE_CLIENT');
  const connections = {
    mysql: {
      connection: {
        host: env('DATABASE_HOST'),
        port: env.int('DATABASE_PORT'),
        database: env('DATABASE_NAME'),
        user: env('DATABASE_USERNAME'),
        password: env('DATABASE_PASSWORD'),
        ssl: env.bool('DATABASE_SSL'),
      },
      pool: { min: env.int('DATABASE_POOL_MIN'), max: env.int('DATABASE_POOL_MAX') },
    },
  };

  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT'),
    },
  };
};
