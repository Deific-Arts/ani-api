# 🚀 Getting started 

This project includes a custom Plugin named Qenna. Qenna is a Stripe integration for Ani. It allows you to create subscriptions and manage subscriptions using the Stripe API. To build and run a watcher for both base Strapi and Qenna, use the `npm run watch` command. 

To test webhooks you'll need login with Stripe every 30 days with `npm run stripe:login`.


## Testing Payments

Use the following fake credit card info to test payment scenarios.

Payment succeeds
4242 4242 4242 4242

Payment requires authentication
4000 0025 0000 3155

Payment is declined
4000 0000 0000 9995


## Useful Links

* https://strapi.io/blog/how-to-build-your-first-strapi-5-plugin
* https://docs.stripe.com/checkout/embedded/quickstart
