import {notFound} from 'next/navigation';
import pages from '@/content/cms-index.json';
import {pageMetadata} from '@/lib/metadata';
type Page = {slug:string;title:string;description:string;content:string};
const content = pages as Page[];
export async function generateMetadata({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params; const page=content.find(p=>p.slug===slug);
  return page ? pageMetadata(page.title,`cms-${slug}`,page.description) : {title:'Page not found'};
}
export default async function ContentPage({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params; const page=content.find(p=>p.slug===slug); if(!page) notFound();
  return <article className="container page-content"><span className="eyebrow">Community notes</span><h1>{page.title}</h1><p>{page.description}</p><div className="cms-body">{page.content}</div></article>;
}
