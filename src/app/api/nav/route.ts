import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const configPath = path.join(process.cwd(), 'nav_config.json');

export async function GET() {
    try {
        if (!fs.existsSync(configPath)) {
            return NextResponse.json([]);
        }
        const data = fs.readFileSync(configPath, 'utf8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read nav config' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const newConfig = await request.json();
        fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save nav config' }, { status: 500 });
    }
}
