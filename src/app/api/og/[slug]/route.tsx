import { ImageResponse } from 'next/og';
import events from '@/content/events.json';
import pages from '@/content/cms-index.json';
export const runtime = 'edge';
const titles: Record<string, string> = { home: 'Learn. Build. Belong.', events: 'Events & study jams', divisions: 'Find your kind of building.', team: 'A community, by its people.', faq: 'Good questions. Clear answers.', roadmap: 'Your next step starts here.', certificates: 'Verify a certificate' };
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = slug.startsWith('cms-')
    ? (pages as {slug:string;title:string}[]).find(p => p.slug === slug.slice(4))?.title
    : titles[slug] || events.find(e => e.slug === slug)?.title;
  if (!title) return new Response('Not found', { status: 404 });
  return new ImageResponse(<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#101722', color: '#fff', width: '100%', height: '100%', padding: 72 }}>
    <div style={{ display: 'flex', fontSize: 28, color: '#8ab4f8' }}>Developer Student Clubs · UHAMKA</div>
    <div style={{ display: 'flex', fontSize: title.length > 65 ? 52 : 72, fontWeight: 700, lineHeight: 1.1 }}>{title.slice(0, 160)}</div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24 }}><span>Learn. Build. Belong.</span><div style={{display:'flex',gap:12}}>{['#4285f4','#ea4335','#fbbc04','#34a853'].map(color=><div key={color} style={{width:24,height:24,borderRadius:12,background:color}}/>)}</div></div>
  </div>, { width: 1200, height: 630, headers: { 'Cache-Control': 'public, max-age=3600' } });
}
