import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'products_master.json');

export async function GET() {
    try {
        if (!fs.existsSync(DATA_PATH)) {
            return NextResponse.json({ error: 'Master data file not found' }, { status: 404 });
        }
        const fileContent = fs.readFileSync(DATA_PATH, 'utf8');
        return NextResponse.json(JSON.parse(fileContent));
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        if (!body.slider || !body.products) {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
        }

        // Automatic ID Generation for new products
        const sanitizedProducts = body.products.map((p: any) => {
            if (!p.id || p.id === 'new' || p.id === '' || p.id === 'temp') {
                const slug = (p.name || 'product').toLowerCase().trim()
                    .replace(/ /g, '-')
                    .replace(/[^-a-z0-9]/g, '');
                return { ...p, id: `${slug}-${Date.now()}` };
            }
            return p;
        });

        const finalData = { ...body, products: sanitizedProducts };

        fs.writeFileSync(DATA_PATH, JSON.stringify(finalData, null, 2));
        return NextResponse.json({ message: 'Data saved successfully', data: finalData });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}
