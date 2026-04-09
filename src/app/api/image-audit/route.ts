import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ONE_MB = 1_048_576;

export async function GET() {
  try {
    const productsPath = path.join(process.cwd(), 'products_master.json');
    if (!fs.existsSync(productsPath)) {
      return NextResponse.json({ error: 'products_master.json not found' }, { status: 404 });
    }

    const data = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
    const products = data.products || [];

    // Check image sizes via HEAD request (Content-Length header)
    const auditResults = await Promise.allSettled(
      products.slice(0, 60).map(async (p: any) => {
        const url = p.images?.product;
        if (!url || !url.startsWith('http')) return null;
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 3000);
          const res = await fetch(url, { method: 'HEAD', signal: controller.signal });
          clearTimeout(timeout);
          const contentLength = res.headers.get('content-length');
          const sizeBytes = contentLength ? parseInt(contentLength) : 0;
          if (sizeBytes > ONE_MB) {
            return {
              id: p.id,
              name: p.name,
              url,
              sizeMB: (sizeBytes / ONE_MB).toFixed(2),
              sizeBytes
            };
          }
          return null;
        } catch {
          return null;
        }
      })
    );

    const oversized = auditResults
      .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled' && r.value !== null)
      .map(r => r.value);

    return NextResponse.json({ oversized, totalChecked: Math.min(products.length, 60) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Image audit failed' }, { status: 500 });
  }
}
