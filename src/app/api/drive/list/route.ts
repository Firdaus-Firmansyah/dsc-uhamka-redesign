// src/app/api/drive/list/route.ts
import { json, rateLimit } from '@/lib/api';
import { drive } from '@/lib/googleDrive';
import type { NextRequest } from 'next/server';

export const maxDuration = 30; // seconds

export async function GET(request: NextRequest) {
  // Rate limit: 30 requests per minute per IP
  const blocked = await rateLimit(request, 'drive', 30);
  if (blocked) return blocked;

  try {
    const res = await drive.files.list({
      pageSize: 20,
      fields: 'files(id,name,mimeType,webViewLink,iconLink)',
    });
    const files = res.data.files ?? [];
    return json({ files }, 200);
  } catch (e: any) {
    console.error('Google Drive error:', e);
    return json({ error: 'Failed to fetch files from Google Drive.' }, 502);
  }
}

