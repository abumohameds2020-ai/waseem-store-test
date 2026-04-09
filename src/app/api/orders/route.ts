import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'orders.json');

export async function GET() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (err) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newOrder = await request.json();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    let orders = JSON.parse(data);
    
    // Auto-generate ID if missing
    if (!newOrder.id) {
      newOrder.id = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    
    // Add timestamp
    newOrder.createdAt = new Date().toISOString();
    newOrder.status = "Pending";
    
    orders.unshift(newOrder); // Add to beginning
    
    await fs.writeFile(DATA_FILE, JSON.stringify(orders, null, 2));
    return NextResponse.json({ success: true, order: newOrder });
  } catch (err) {
    console.error("Order creation failed", err);
    return NextResponse.json({ error: 'System processing error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    let orders = JSON.parse(data);
    
    const index = orders.findIndex((o: any) => o.id === id);
    if (index !== -1) {
      orders[index].status = status;
      await fs.writeFile(DATA_FILE, JSON.stringify(orders, null, 2));
      return NextResponse.json({ success: true, order: orders[index] });
    }
    
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ error: 'System processing error' }, { status: 500 });
  }
}
