import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt } = body;

    // Read the API Key from the settings database
    const productsPath = path.join(process.cwd(), 'products_master.json');
    let apiKey = '';
    if (fs.existsSync(productsPath)) {
      const db = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
      apiKey = db.settings?.ai?.gemini_key || '';
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API Key missing! Please add it in the Advanced tab.' },
        { status: 400 }
      );
    }

    // Call Google Gemini REST API (gemini-2.5-flash for speed)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        }
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || 'Failed to connect to Gemini' }, { status: response.status });
    }

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    return NextResponse.json({ text: generatedText });

  } catch (err: any) {
    console.error('Gemini error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
