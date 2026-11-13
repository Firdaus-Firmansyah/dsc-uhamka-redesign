import Image from 'next/image';
import type { ReactNode } from 'react';
import assets from '@/content/assets.json';
export function Photo({src,alt,className='',priority=false,sizes='(max-width: 700px) 100vw, 50vw'}:{src:string;alt:string;className?:string;priority?:boolean;sizes?:string}) {
 const asset=(assets as Record<string,{src:string;width:number;height:number;blur:string}>)[src];
 if(!asset) return <span className={`photo-placeholder ${className}`} role="img" aria-label={alt||'Community portrait'}><span aria-hidden="true">{(alt||'DSC').replace(/,.*$/,'').split(' ').filter(Boolean).slice(0,2).map(w=>w[0]).join('')}</span></span>;
 return <Image src={asset?.src||src} alt={alt} width={asset?.width||1200} height={asset?.height||800} placeholder="blur" blurDataURL={asset?.blur||'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZWVlZWVlIi8+PC9zdmc+'} className={className} priority={priority} sizes={sizes}/>;
}
export function Badge({children,tone='neutral'}:{children:ReactNode;tone?:string}) {return <span className={`badge ${tone}`}>{children}</span>}
export function SectionHeading({eyebrow,title,children,action}:{eyebrow:string;title:string;children?:ReactNode;action?:ReactNode}) { return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{children&&<p>{children}</p>}</div>{action}</div> }
export function PageHeading({eyebrow,title,children}:{eyebrow:string;title:string;children:ReactNode}) {return <header className="page-heading"><span className="eyebrow"><span className="tiny-dot"/>{eyebrow}</span><h1>{title}</h1><p>{children}</p></header>}
