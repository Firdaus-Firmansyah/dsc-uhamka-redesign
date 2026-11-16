// src/app/api/content/[slug]/route.ts
import { json, rateLimit } from '@/lib/api';
import type { NextRequest } from 'next/server';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const maxDuration = 10; // seconds

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Rate limit per IP for content requests
  const blocked = await rateLimit(request, 'content', 60);
  if (blocked) return blocked;

  const filePath = join(process.cwd(), 'src', 'content', `${slug}.json`);
  try {
    const data = await readFile(filePath, { encoding: 'utf8' });
    const jsonData = JSON.parse(data);
    return json(jsonData, 200);
  } catch (e) {
    console.error('Content fetch error', e);
    return json({ error: 'Content not found' }, 404);
  }
}

