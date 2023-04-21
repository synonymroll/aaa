const {getArnieById, listArnies, putArnieById} = require('./arnie');

const getOpenApi = async (c, ctx) => {
  ctx.body = JSON.stringify(c.api.definition);
};

const notFound = async (c, ctx) => {
  ctx.status = 404;
  ctx.body = {error: 'Not found'};
};

const validationFail = async (c, ctx) => {
  ctx.status = 400;
  ctx.body = {error: c.validation.errors};
};

module.exports = {
  getArnieById,
  getOpenApi,
  listArnies,
  putArnieById,
  notFound,
  validationFail,
};
