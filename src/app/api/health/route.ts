import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const dbFiles = [
    'products_master.json',
    'orders.json',
    'logs.json',
    'reviews.json'
  ];

  const healthData = {
    fileStats: [] as any[],
    brokenLinks: [] as string[],
    totalProducts: 0
  };

  try {
    // Fast: Audit File Sizes only (no blocking network calls)
    for (const file of dbFiles) {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        healthData.fileStats.push({
          name: file,
          size: (stats.size / 1024).toFixed(2) + ' KB',
          status: 'Online'
        });
      } else {
        healthData.fileStats.push({ name: file, size: '0 KB', status: 'Offline' });
      }
    }

    // Count products from JSON (fast, local file read only)
    const productsPath = path.join(process.cwd(), 'products_master.json');
    if (fs.existsSync(productsPath)) {
      const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
      healthData.totalProducts = (productsData.products || []).length;
      // NOTE: URL validation is intentionally excluded from this endpoint
      // to keep dashboard load time instant. brokenLinks stays empty by default.
    }

    return NextResponse.json(healthData);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Health Audit Failed' }, { status: 500 });
  }
}
