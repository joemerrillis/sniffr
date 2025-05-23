import {
  listClientWalkWindows,
  getClientWalkWindow,
  createClientWalkWindow,
  updateClientWalkWindow,
  deleteClientWalkWindow,
  listWindowsForWeek,
  seedPendingWalksForWeek // <-- NEW (for seeding)
} from '../services/clientWalkWindowsService.js';

/**
 * Helper to extract the authenticated user's ID from the JWT.
 */
function getUserId(request) {
  return request.user.id ?? request.user.sub;
}

/**
 * GET /client-windows
 * If ?week_start=YYYY-MM-DD is provided, returns only that week's windows,
 * otherwise returns all windows for the current user.
 */
async function listWindows(request, reply) {
  const userId = getUserId(request);
  const { week_start } = request.query;

  let windows;
  if (week_start) {
    windows = await listWindowsForWeek(request.server, userId, week_start);
  } else {
    windows = await listClientWalkWindows(request.server, userId);
  }

  reply.send({ windows });
}

/**
 * TENANT: List all windows for a client (optionally for a given week).
 * Only returns results if the (tenant_id, client_id) association exists in tenant_clients.
 * GET /tenants/:tenant_id/clients/:client_id/walk-windows
 */
async function listClientWindowsForTenant(request, reply) {
  const { tenant_id, client_id } = request.params;
  const { week_start } = request.query;

  // Security: check that tenant_id has access to client_id
  const { data: tenantClient, error } = await request.server.supabase
    .from('tenant_clients')
    .select('id')
    .eq('tenant_id', tenant_id)
    .eq('client_id', client_id)
    .eq('accepted', true)
    .single();

  if (error || !tenantClient) {
    return reply.code(404).send({ error: 'Client not found for this tenant.' });
  }

  let windows;
  if (week_start) {
    windows = await listWindowsForWeek(request.server, client_id, week_start);
  } else {
    windows = await listClientWalkWindows(request.server, client_id);
  }

  reply.send({ windows });
}

/**
 * GET /client-windows/:id
 */
async function getWindow(request, reply) {
  const userId = getUserId(request);
  const { id } = request.params;
  const window = await getClientWalkWindow(request.server, userId, id);
  if (!window) return reply.code(404).send({ error: 'Window not found' });
  reply.send({ window });
}

/**
 * POST /client-windows
 */
async function createWindow(request, reply) {
  const userId = getUserId(request);
  const {
    day_of_week,
    window_start,
    window_end,
    effective_start,
    effective_end
  } = request.body;

  if (
    typeof day_of_week !== 'number' ||
    !Number.isInteger(day_of_week) ||
    day_of_week < 0 ||
    day_of_week > 6
  ) {
    return reply
      .code(400)
      .send({ error: 'day_of_week must be an integer 0 (Sunday) through 6 (Saturday)' });
  }

  const payload = {
    user_id:        userId,
    day_of_week,
    window_start,
    window_end,
    effective_start,
    effective_end
  };

  const window = await createClientWalkWindow(request.server, payload);
  reply.code(201).send({ window });
}

/**
 * PATCH /client-windows/:id
 */
async function updateWindow(request, reply) {
  const userId = getUserId(request);
  const { id } = request.params;
  const {
    day_of_week,
    window_start,
    window_end,
    effective_start,
    effective_end
  } = request.body;

  const payload = {};
  if (day_of_week !== undefined) {
    if (
      typeof day_of_week !== 'number' ||
      !Number.isInteger(day_of_week) ||
      day_of_week < 0 ||
      day_of_week > 6
    ) {
      return reply
        .code(400)
        .send({ error: 'day_of_week must be an integer 0 (Sunday) through 6 (Saturday)' });
    }
    payload.day_of_week = day_of_week;
  }
  if (window_start    !== undefined) payload.window_start    = window_start;
  if (window_end      !== undefined) payload.window_end      = window_end;
  if (effective_start !== undefined) payload.effective_start = effective_start;
  if (effective_end   !== undefined) payload.effective_end   = effective_end;

  const window = await updateClientWalkWindow(request.server, userId, id, payload);
  if (!window) return reply.code(404).send({ error: 'Window not found' });
  reply.send({ window });
}

/**
 * DELETE /client-windows/:id
 */
async function deleteWindow(request, reply) {
  const userId = getUserId(request);
  const { id } = request.params;
  await deleteClientWalkWindow(request.server, userId, id);
  reply.code(204).send();
}

/**
 * POST /client-windows/seed-now
 * Seeds pending walks for the remainder of this week based on current walk windows.
 */
async function seedWalksForCurrentWeek(request, reply) {
  const userId = request.body.user_id || request.user.id || request.user.sub;
  const today = new Date();
  // Get the next Sunday
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

  const seededCount = await seedPendingWalksForWeek(request.server, userId, today, endOfWeek);
  reply.send({ seeded: seededCount });
}

export {
  listWindows,
  listClientWindowsForTenant,
  getWindow,
  createWindow,
  updateWindow,
  deleteWindow,
  seedWalksForCurrentWeek // <-- NEW export for seeding
};
