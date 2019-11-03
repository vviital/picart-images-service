const express = require('express');

const config = require('./config');
const middlewares = require('./middlewares');
const { handler } = require('./handlers');
const Logger = require('./logger');

const withError = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

const appRoutes = [
  {
    method: 'get',
    path: '/',
    env: 'development',
    mode: 'rw',
    handler: (...args) => handler.getStaticPage(...args),
  },
  {
    method: 'post',
    path: '/images',
    middlewares: [middlewares.storage],
    env: 'all',
    mode: 'w',
    handler: (...args) => handler.upload(...args),
  },
  {
    method: 'get',
    path: '/images',
    env: 'development',
    mode: 'rw',
    handler: (...args) => handler.getMetaInfo(...args),
  },
  {
    method: 'get',
    path: '/images/:id',
    env: 'all',
    mode: 'r',
    handler: (...args) => handler.fetch(...args),
  },
  {
    method: 'delete',
    path: '/images/:id',
    env: 'all',
    mode: 'w',
    handler: (...args) => handler.delete(...args),
  },
  {
    method: 'get',
    path: '/config',
    env: 'development',
    mode: 'rw',
    handler: (...args) => handler.config(...args),
  },
  {
    method: 'get',
    path: '/service/health',
    env: 'all',
    mode: 'rw',
    handler: (...args) => handler.health(...args),
  }
];

/* eslint-disable no-bitwise */
const modeToMask = (mode = '') => {
  let mask = 0;

  if (mode.includes('w')) {
    mask |= 1;
  }

  if (mode.includes('r')) {
    mask |= (1 << 1);
  }

  return mask;
};

const shouldSkip = (definition) => {
  if (definition.env !== 'all' && definition.env !== config.env) {
    return false;
  }

  const routeMask = modeToMask(definition.mode);
  const configMask = modeToMask(config.mode);

  if (routeMask & configMask) {
    return false;
  }

  return true;
};

const constructRouter = (routes) => {
  const router = new express.Router();

  for (let i = 0; i < routes.length; i += 1) {
    const route = routes[i];

    if (shouldSkip(route)) {
      Logger.info('skipping route', route.method, route.path);
      // eslint-disable-next-line
      continue;
    }

    Logger.info('adding route', route.method, route.path);

    const mdls = route.middlewares || [];
    router[route.method](route.path, ...mdls, withError(route.handler));
  }

  return router;
};

module.exports = {
  constructRouter,
  create: () => constructRouter(appRoutes),
};
