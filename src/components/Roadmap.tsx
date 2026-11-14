'use client';
import {useState} from 'react';
import Link from 'next/link';
import {motion,useReducedMotion} from 'framer-motion';
import milestones from '@/content/roadmap.json';
const statuses=['all','planned','in-progress','completed'];
export default function Roadmap(){
 const [filter,setFilter]=useState('all');const reduced=useReducedMotion();
 const visible=milestones.filter(m=>filter==='all'||m.status===filter);
 return <><div className="roadmap-filters" role="group" aria-label="Filter roadmap by status">{statuses.map(status=><button key={status} className="button secondary" aria-pressed={filter===status} onClick={()=>setFilter(status)}>{status.replace('-',' ')}</button>)}</div><p role="status" className="fine-print">{visible.length} milestones</p><ol className="roadmap-list">{visible.map((m,i)=><motion.li key={m.title} initial={reduced?false:{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*.06}}><span className="roadmap-step" aria-hidden="true">{String(milestones.indexOf(m)+1).padStart(2,'0')}</span><details className="feature-card"><summary><span className="eyebrow">{m.date} · {m.status.replace('-',' ')}</span><h2>{m.title}</h2><span className="fine-print">Explore this step +</span></summary><p>{m.description}</p><Link className="button secondary" href={m.href}>Explore resources →</Link></details></motion.li>)}</ol>{!visible.length&&<p className="feature-card">No milestones with this status yet.</p>}</>;
}
