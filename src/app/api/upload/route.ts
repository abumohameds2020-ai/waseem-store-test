import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        
        // Sanitize and timestamp the filename
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
        const filename = `${timestamp}_${safeName}`;
        
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, buffer);

        // Return the public URL
        const publicUrl = `/uploads/${filename}`;
        return NextResponse.json({ url: publicUrl });
    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            return NextResponse.json([]);
        }

        const metaPath = path.join(uploadDir, 'meta.json');
        let meta: Record<string, string> = {};
        if (fs.existsSync(metaPath)) {
            try {
                meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
            } catch (e) {}
        }

        const files = fs.readdirSync(uploadDir);
        const fileData = files
            .filter(file => !file.startsWith('.') && !file.endsWith('.json'))
            .map(file => ({
                url: `/uploads/${file}`,
                tag: meta[file] || 'Unassigned'
            }))
            .sort((a, b) => b.url.localeCompare(a.url));

        return NextResponse.json(fileData);
    } catch (error) {
        console.error('List Error:', error);
        return NextResponse.json({ error: 'Failed to list files' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const { filename, tag } = await request.json();
        if (!filename) return NextResponse.json({ error: 'Filename missing' }, { status: 400 });

        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        const metaPath = path.join(uploadDir, 'meta.json');
        
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        let meta: Record<string, string> = {};
        if (fs.existsSync(metaPath)) {
            try { meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8')); } catch (e) {}
        }

        meta[filename.replace('/uploads/', '')] = tag;
        fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update metadata' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { filenames } = await request.json(); // Array of filenames
        if (!filenames || !Array.isArray(filenames)) {
            return NextResponse.json({ error: 'Invalid filenames array' }, { status: 400 });
        }

        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        const metaPath = path.join(uploadDir, 'meta.json');
        
        let meta: Record<string, string> = {};
        if (fs.existsSync(metaPath)) {
            try { meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8')); } catch (e) {}
        }

        const results = filenames.map(url => {
            const filename = url.replace('/uploads/', '');
            const filePath = path.join(uploadDir, filename);
            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    delete meta[filename];
                    return { url, status: 'deleted' };
                }
                return { url, status: 'not_found' };
            } catch (err) {
                return { url, status: 'error' };
            }
        });

        fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
        return NextResponse.json({ message: 'Purge operation complete', results });
    } catch (error) {
        return NextResponse.json({ error: 'Purge protocol failed' }, { status: 500 });
    }
}
