export default ({ env }) => ({
  qenna: {
    enabled: true,
    resolve: './src/plugins/qenna',
    config: {
      ui_url: env('UI_URL'),
      environment: env('NODE_ENV'),
      test_key: env('STRAPI_ADMIN_LIVE_STRIPE_SECRET_KEY'),
      live_key: env('STRAPI_ADMIN_TEST_STRIPE_SECRET_KEY'),
    },
  },
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.titan.email'),
        port: env('SMTP_PORT', 587),
        auth: {
          user: 'donotreply@deificarts.com',
          pass: env('MAIL_PASSWORD'),
        },
      },
      settings: {
        defaultFrom: 'donotreply@deificarts.com',
        defaultReplyTo: 'donotreply@deificarts.com',
      },
    },
  },
});
