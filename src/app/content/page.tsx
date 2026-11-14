import Link from 'next/link';
import pages from '@/content/cms-index.json';
import {pageMetadata} from '@/lib/metadata';
export const metadata=pageMetadata('Community notes','home');
export default function ContentIndex(){return <section className="container page-content"><h1>Community notes.</h1><p>Updates from DSC UHAMKA.</p>{pages.length ? (pages as {slug:string;title:string;description:string}[]).map(p=><article className="feature-card" key={p.slug}><h2><Link href={`/content/${p.slug}`}>{p.title}</Link></h2><p>{p.description}</p></article>) : <p className="feature-card">No community notes published yet. Explore our events while you wait.</p>}</section>}
