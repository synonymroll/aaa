const addFormats = require('ajv-formats');
const { isHttpError } = require('http-errors');
const Koa = require('koa');
const OpenAPIBackend = require('openapi-backend').default;
const cors = require('@koa/cors');
const bodyparser = require('koa-bodyparser');
const helmet = require('koa-helmet');
const pino = require('pino');

const handlers = require('./handlers');

const log = pino();

const api = new OpenAPIBackend({
  definition: './openapi/v1.yml',
  apiRoot: '/v1',
  quick: true,
  validate: true,
  customizeAjv: (ajv) => {
    addFormats(ajv);
    return ajv;
  },
});
api.register({
  ...handlers,
  postResponseHandler: (c, { request, response }) => {
    try {
      const valid = c.api.validateResponse(response.body, c.operation);
      if (valid.errors) {
        log.warn('Response validation failed for', request.url, valid.errors);
      }
    } catch (e) {
      log.error(e);
    }
  },
});

const app = new Koa();
app.use(bodyparser());
app.use(cors());
app.use(helmet());
app.use(async (ctx) => {
  try {
    await api.handleRequest(ctx.request, ctx);
  } catch (err) {
    let status;
    let message;
    if (isHttpError(err)) {
      status = err.status;
      message = err.message;
    } else {
      log.warn(err);
      status = 500;
      message = 'Internal Server Error';
    }
    ctx.response.status = status;
    ctx.response.message = JSON.stringify({
      status,
      message,
    });
  }
});
app.listen(4000);
