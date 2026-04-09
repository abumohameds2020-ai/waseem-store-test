import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const REVIEWS_FILE = path.join(process.cwd(), 'reviews.json');

export async function GET() {
  try {
    const data = await fs.readFile(REVIEWS_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (err) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    const data = await fs.readFile(REVIEWS_FILE, 'utf-8');
    let reviews = JSON.parse(data);
    
    reviews = reviews.map((r: any) => 
      r.id === id ? { ...r, status } : r
    );
    
    await fs.writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to moderate review' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const data = await fs.readFile(REVIEWS_FILE, 'utf-8');
    let reviews = JSON.parse(data);
    
    reviews = reviews.filter((r: any) => r.id !== id);
    
    await fs.writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
