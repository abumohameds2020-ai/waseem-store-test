import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

export async function GET() {
  const dbFiles = [
    'products_master.json',
    'orders.json',
    'logs.json',
    'reviews.json'
  ];

  try {
    const zip = new JSZip();
    const folder = zip.folder(`KZ_PHANTOM_ARCHIVE_${new Date().toISOString().split('T')[0]}`);

    for (const file of dbFiles) {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        folder?.file(file, content);
      }
    }

    const archiveBuffer = await zip.generateAsync({ 
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 9 } 
    });
    
    // Convert Buffer to Uint8Array to satisfy BodyInit type
    const responseBuffer = new Uint8Array(archiveBuffer);

    return new Response(responseBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename=KZ_PHANTOM_ENGINEERING_SNAPSHOT_${new Date().toISOString().split('T')[0]}.zip`,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Security Snapshot Failed' }, { status: 500 });
  }
}
