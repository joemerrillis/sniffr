import Fastify from 'fastify';
import dotenv from 'dotenv';

// register the Fastify JWT plugin directly
import fastifyJwt from '@fastify/jwt';

import corePlugin           from './src/core/index.js';
import authPlugin           from './src/auth/index.js';
import usersPlugin          from './src/users/index.js';
import tenantsPlugin        from './src/tenants/index.js';
import domainsPlugin        from './src/domains/index.js';
import dogsPlugin           from './src/dogs/index.js';
import visibilityPlugin     from './src/dogVisibility/index.js';
import dogFriendsPlugin     from './src/dogFriends/index.js';
import dogAssignmentsPlugin from './src/dogAssignments/index.js';

dotenv.config();

const fastify = Fastify({ logger: true });

// Core (Supabase client, error hooks, logging)
fastify.register(corePlugin);

// JWT setup
fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET
});

// decorate an `authenticate` method for protecting routes
fastify.decorate('authenticate', async function(request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

// Auth routes (register, login, profile) — unprotected
fastify.register(authPlugin, { prefix: '/auth' });

// Health check — unprotected
fastify.get('/', async () => ({ status: 'ok' }));

// Protect everything else
fastify.addHook('onRequest', fastify.authenticate);

// Application modules
fastify.register(usersPlugin,          { prefix: '/users' });
fastify.register(tenantsPlugin,        { prefix: '/tenants' });
fastify.register(domainsPlugin,        { prefix: '/domains' });
fastify.register(dogsPlugin,           { prefix: '/dogs' });
fastify.register(visibilityPlugin,     { prefix: '/dogs/:id/visibility' });
fastify.register(dogFriendsPlugin,     { prefix: '/dog-friends' });
fastify.register(dogAssignmentsPlugin, { prefix: '/dog-assignments' });

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    await fastify.listen({ port, host: '0.0.0.0' });
    fastify.log.info(`🚀 Server listening on 0.0.0.0:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
