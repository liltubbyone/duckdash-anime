import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') {
      return Response.json({ error: 'Forbidden — admins only' }, { status: 403 });
    }

    const body = await req.json();
    const { race_id } = body || {};
    if (!race_id) return Response.json({ error: 'Missing race_id' }, { status: 400 });

    const race = await base44.asServiceRole.entities.DuckRace.get(race_id);
    if (!race) return Response.json({ error: 'Race not found' }, { status: 404 });

    const entries = await base44.asServiceRole.entities.RaceEntry.filter({ race_id });
    const userIds = [...new Set(entries.map((e) => e.user_id).filter(Boolean))];

    const raceName = race.race_name || (race.is_mass_race ? 'Mass Race' : 'Duck Race');
    const origin = new URL(req.url).origin;
    const watchUrl = `${origin}/?race=${race_id}`;
    const subject = `🦆 Your race "${raceName}" is starting now!`;
    const emailBody =
      `The duck race "${raceName}" is starting right now — jump on and watch the action!\n\n` +
      `Watch here: ${watchUrl}\n\nGood luck! 🏁`;

    let sent = 0;
    for (const uid of userIds) {
      try {
        const u = await base44.asServiceRole.entities.User.get(uid);
        if (u && u.email) {
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: u.email,
            subject,
            body: emailBody,
          });
          sent++;
        }
      } catch (e) {
        console.error('notify-race-start: failed to email user', uid, e);
      }
    }

    return Response.json({ ok: true, notified: sent, participants: userIds.length });
  } catch (error) {
    console.error('notify-race-start error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}