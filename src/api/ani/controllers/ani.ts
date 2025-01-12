const { sanitize } = require('@strapi/utils');

const destroyMe = async (ctx) => {
  try {
    const authUser = ctx.state.user;

    if (!authUser) {
      return ctx.unauthorized();
    }

    await strapi.query('plugin::users-permissions.user').delete({
      where: { id: authUser.id },
    });

    ctx.send({ message: 'OK' }, 200);
  } catch (error) {
    ctx.send({
      error
    }, 400);
  }
};

export default {
  destroyMe,
};
