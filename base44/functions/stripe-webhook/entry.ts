import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import Stripe from 'npm:stripe@17.6.0';
import { secrets } from 'base44:runtime';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const apiKey = secrets.get('STRIPE_SECRET_KEY');
    const webhookSecret = secrets.get('STRIPE_WEBHOOK_SECRET');
    const signature = req.headers.get('stripe-signature');
    const rawBody = await req.text();

    const stripe = new Stripe(apiKey);

    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return Response.json({ error: 'Invalid signature' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const md = session.metadata || {};
      const race_id = md.race_id;
      if (!race_id) return Response.json({ received: true });

      const race = await base44.asServiceRole.entities.DuckRace.get(race_id);
      if (!race) {
        console.warn('stripe-webhook: race not found', race_id);
        return Response.json({ received: true });
      }

      const entries = await base44.asServiceRole.entities.RaceEntry.filter({ race_id });
      if (entries.length >= race.total_lanes) {
        console.warn('stripe-webhook: race full, entry not created');
        return Response.json({ received: true });
      }

      // Assign lane: preferred if still free, otherwise next available
      const takenLanes = new Set(entries.map(e => e.lane_number));
      let lane = parseInt(md.preferred_lane, 10);
      if (!lane || takenLanes.has(lane)) {
        lane = 1;
        while (takenLanes.has(lane) && lane <= race.total_lanes) lane++;
      }

      await base44.asServiceRole.entities.RaceEntry.create({
        race_id,
        lane_number: lane,
        player_name: md.player_name,
        duck_name: md.duck_name,
        duck_color: md.duck_color,
        hat: md.hat || 'none',
        glasses: md.glasses || 'none',
        clothes: md.clothes || 'none',
        user_id: md.user_id || undefined,
        is_winner: false,
      });
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('stripe-webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}