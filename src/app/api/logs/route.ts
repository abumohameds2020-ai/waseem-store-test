import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const LOGS_FILE = path.join(process.cwd(), 'logs.json');

export async function GET() {
  try {
    const data = await fs.readFile(LOGS_FILE, 'utf-8');
    const logs = JSON.parse(data);
    // Return only the last 15 logs, newest first
    return NextResponse.json(logs.reverse().slice(0, 15));
  } catch (err) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action, details } = await request.json();
    const data = await fs.readFile(LOGS_FILE, 'utf-8');
    let logs = JSON.parse(data);
    
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      details
    };
    
    logs.push(newLog);
    // Keep internal storage trimmed if needed, but here we keep full history and trim on GET
    await fs.writeFile(LOGS_FILE, JSON.stringify(logs, null, 2));
    
    return NextResponse.json({ success: true, log: newLog });
  } catch (err) {
    return NextResponse.json({ error: 'Log recording failure' }, { status: 500 });
  }
}
