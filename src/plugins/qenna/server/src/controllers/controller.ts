import type { Core } from '@strapi/strapi';
import Stripe from 'stripe';

const uiURL = strapi.config.get('plugin::qenna.config.ui_url') || process.env.UI_URL;
const environment = strapi.config.get('plugin::qenna.config.environment') || process.env.NODE_ENV;
const test_key = strapi.config.get('plugin::qenna.config.test_key') || process.env.STRAPI_ADMIN_LIVE_STRIPE_SECRET_KEY;
const live_key = strapi.config.get('plugin::qenna.config.live_key') || process.env.STRAPI_ADMIN_TEST_STRIPE_SECRET_KEY;
const isProduction = environment === "production";
const mode = isProduction ? test_key: live_key;
const stripe = new Stripe(mode as string);

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('qenna')
      .service('service')
      .getWelcomeMessage();
  },
  async createCheckoutSession(ctx) {
    const request = ctx.request;
    const response = ctx.response;

    const prices = await stripe.prices.list({
      lookup_keys: [request.body.lookup_key],
      expand: ['data.product',]
    });

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: prices.data[0].id,
          quantity: 1,
        },
      ],
      customer_email: request.body.email,
      mode: 'subscription',
      ui_mode: "embedded",
      return_url: `${uiURL}/membership/success?session_id={CHECKOUT_SESSION_ID}`,
    });

    response.send({clientSecret: session.client_secret})
  },
  async createPortalSession(ctx) {
    const { member_id } = JSON.parse(ctx.request.body);

    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: member_id,
        return_url: `${uiURL}/profile`,
      });

      ctx.send({
        url: session.url,
      }, 200);
    } catch (error) {
      ctx.send({
        error,
        message: 'There was a problem creating your portal session. Please contact support at contact@deificarts.com'
      }, 400)
    }
  },

  async createMembership(ctx) {
    const body = JSON.parse(ctx.request.body);
    const { session_id, user_id, jwt } = body;

    try {
      const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
      const memberId = checkoutSession.customer;

      await fetch(`${process.env.APP_URL}/api/users/${user_id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify({ memberId }),
      });

      ctx.send({
        message: 'OK',
      }, 200);
    } catch {
      ctx.send({
        error: {
          message: 'There was problem finalizing your membership. Please contact support at contact@deificarts.com'
        }
      }, 400);
    }
  },

  async cancelMembership(ctx) {
    const { member_id } = ctx.request.body;
    const subscriptions = await stripe.subscriptions.list({
      customer: member_id
    });

    try {
      const subscriptionIds = subscriptions.data.map(subscription => subscription.id);
      subscriptionIds.forEach(async subscriptionId => {
        await stripe.subscriptions.cancel(subscriptionId);
      });
      ctx.send({ message: 'OK' }, 200);
    } catch (error) {
      ctx.send({
        error,
        message: 'There was a problem canceling your membership. Please contact support at contact@deificarts.com',
      }, 400);
    }

  },
  webhook(ctx) {
    let event = ctx.request.body;

    // TODO: skipping verification for now, cant figure out raw body issue
    // reference: https://forum.strapi.io/t/get-raw-request-body-in-custom-controller/14560/19
    // if (process.env.STRIPE_WEBHOOK_SECRET) {
    //   const signature = ctx.request.headers['stripe-signature'];
    //   try {
    //     event = stripe.webhooks.constructEvent(
    //       ctx.request.rawBody,
    //       signature,
    //       process.env.STRIPE_WEBHOOK_SECRET
    //     );
    //   } catch (error) {
    //     console.log(`⚠️  Webhook signature verification failed.`, error.message);
    //     return ctx.send({
    //       error: error,
    //     }, 400);;
    //   }
    // }

    let subscription;
    let status;

    switch (event.type) {
      case 'customer.subscription.trial_will_end':
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription trial ending.
        // handleSubscriptionTrialEnding(subscription);
        break;
      case 'customer.subscription.deleted':
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription deleted.
        // handleSubscriptionDeleted(subscriptionDeleted);
        break;
      case 'customer.subscription.created':
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        break;
      case 'customer.subscription.updated':
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription update.
        // handleSubscriptionUpdated(subscription);
        break;
      case 'entitlements.active_entitlement_summary.updated':
        subscription = event.data.object;
        console.log(`Active entitlement summary updated for ${subscription}.`);
        // Then define and call a method to handle active entitlement summary updated
        // handleEntitlementUpdated(subscription);
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }

    ctx.send({
      message: 'Successfully fired webhook'
    }, 200);
  }
});

export default controller;
