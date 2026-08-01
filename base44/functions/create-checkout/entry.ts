import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const {
      race_id,
      preferred_lane,
      player_name,
      duck_name,
      duck_color,
      hat,
      glasses,
      clothes,
      user_id,
    } = body || {};

    if (!race_id || !player_name || !duck_name || !duck_color) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const race = await base44.asServiceRole.entities.DuckRace.get(race_id);
    if (!race) return Response.json({ error: 'Race not found' }, { status: 404 });
    if (race.status !== 'waiting') {
      return Response.json({ error: 'Race is not open for buy-in' }, { status: 400 });
    }

    const entries = await base44.asServiceRole.entities.RaceEntry.filter({ race_id });
    if (entries.length >= race.total_lanes) {
      return Response.json({ error: 'Race is full' }, { status: 400 });
    }

    const apiKey = secrets.get('STRIPE_SECRET_KEY');
    const referer = req.headers.get('referer') || req.headers.get('origin');
    const origin = referer ? new URL(referer).origin : new URL(req.url).origin;
    const successUrl = `${origin}/?payment=success`;
    const cancelUrl = `${origin}/?payment=cancelled`;

    const params = new URLSearchParams();
    params.append('mode', 'payment');
    params.append('line_items[0][quantity]', '1');
    params.append('line_items[0][price_data][currency]', 'usd');
    params.append('line_items[0][price_data][product_data][name]', `Race Buy-In: ${duck_name}`);
    params.append('line_items[0][price_data][unit_amount]', String(Math.round(race.buy_in_amount * 100)));
    params.append('success_url', successUrl);
    params.append('cancel_url', cancelUrl);

    const metadata = {
      base44_app_id: Deno.env.get('BASE44_APP_ID') || '',
      race_id,
      preferred_lane: String(preferred_lane || ''),
      player_name,
      duck_name,
      duck_color,
      hat: hat || 'none',
      glasses: glasses || 'none',
      clothes: clothes || 'none',
      user_id: user_id || '',
    };
    for (const [k, v] of Object.entries(metadata)) {
      params.append(`metadata[${k}]`, String(v));
    }

    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: params,
    });
    const session = await res.json();
    if (!res.ok) {
      console.error('Stripe checkout error:', session);
      throw new Error(session?.error?.message || 'Stripe error');
    }

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('create-checkout error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}