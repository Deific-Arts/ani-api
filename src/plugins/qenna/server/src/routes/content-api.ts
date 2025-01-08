export default [
  {
    method: 'GET',
    path: '/',
    handler: 'controller.index',
  },
  {
    method: 'POST',
    path: '/create-checkout-session',
    handler: 'controller.createCheckoutSession',
  },
  {
    method: 'POST',
    path: '/create-portal-session',
    handler: 'controller.createPortalSession',
  },
  {
    method: 'POST',
    path: '/create-membership',
    handler: 'controller.createMembership',
  },
  {
    method: 'POST',
    path: '/webhook',
    handler: 'controller.webhook',
  }
];
