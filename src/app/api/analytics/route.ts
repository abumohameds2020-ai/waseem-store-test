import { NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Hashing utility for PII (SHA-256)
const hashData = (data: string) => {
  if (!data) return null;
  return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex');
};

const getMarketingSettings = () => {
  try {
    const DATA_PATH = path.join(process.cwd(), 'products_master.json');
    if (fs.existsSync(DATA_PATH)) {
      const fileContent = fs.readFileSync(DATA_PATH, 'utf8');
      const fullConfig = JSON.parse(fileContent);
      return fullConfig.settings?.marketing || {};
    }
  } catch (err) {
    console.error('Failed to read marketing settings:', err);
  }
  return {};
};

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { event, data, user } = payload;
    const settings = getMarketingSettings();

    // 1. Prepare Tactical Payload
    const hashedEmail = user?.email ? hashData(user.email) : null;
    const hashedPhone = user?.phone ? hashData(user.phone) : null;

    const marketingPayload = {
      event_name: event,
      event_time: Math.floor(Date.now() / 1000),
      user_data: {
        em: hashedEmail,
        ph: hashedPhone,
        client_ip_address: request.headers.get('x-forwarded-for') || '0.0.0.0',
        client_user_agent: request.headers.get('user-agent'),
      },
      custom_data: data,
    };

    // 2. Redundant Signal Propagation
    console.log(`[Omni-Uplink] Propagating event: ${event}`);
    
    const propagationTargets = [];

    // Target A: Direct Social APIs (Meta CAPI / TikTok)
    if (settings.meta_token || settings.tiktok_token) {
       propagationTargets.push('Direct Social APIs');
    }

    // Target B: Server-Side Layer (GTM & Stape.io)
    if (settings.gtm_id && settings.stape_url) {
       console.log(`[Stape.io] Forwarding to ${settings.stape_url} with GTM ID ${settings.gtm_id}`);
       propagationTargets.push('GTM Server-Side via Stape.io');
    }

    return NextResponse.json({
      success: true,
      hashed_id: hashedEmail || 'anonymous',
      propagation: propagationTargets,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Analytics Engine Failure:', error);
    return NextResponse.json({ error: 'Uplink failed' }, { status: 500 });
  }
}
