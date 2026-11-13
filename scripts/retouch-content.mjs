import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const members=read('src/content/team.json');
for(const m of members){
 if(m.image==='/images/deta.webp'){m.name='Deeta Zamel Aulia';m.links={};}
 if(m.image==='/images/regis.webp')m.name='Regissya Anfieldasari F. A.';
 if(m.image==='/images/Salva.webp')m.name='Salvalynda Riana Putri';
 if(m.image==='/images/fayza.webp')m.name='Fayza Nadya Ulya';
}
write('src/content/team.json',members);
const events=read('src/content/events.json').filter(e=>!['data-storytelling-tableau','beyond-the-surface'].includes(e.slug));
events[1].shortTitle='Bikin bukan asal bikin.';
events[1].description='Explore user-centered design: the difference between UI and UX, empathy for users, and how designers turn real problems into thoughtful solutions. A community crash course with DSC UHAMKA instructors and a guest practitioner.';
const base={registrationUrl:null,registration:'closed',prerequisites:[],agenda:[],gallery:[]};
events.push({...base,slug:'data-storytelling-tableau',title:'Data Storytelling: Ultimate Tricks for Data Visualization Using Tableau',shortTitle:'Make your data tell a story.',division:'The Vectors',format:'Online',kind:'Tech talk',start:'2026-06-27T13:00:00+07:00',end:'2026-06-27T16:00:00+07:00',image:'/images/Tableau.png',description:'Turn spreadsheet rows into clear, interactive stories. Explore Tableau Public, dimensions and measures, charts, maps, and dashboards with Dicky Lihardo Girsang.',location:'Online · Google Meet',tags:['Tableau','Data analytics','Data visualization'],speakers:[{name:'Dicky Lihardo Girsang',role:'Data Science Indonesia · Data Analyst Flight at Traveloka',image:'/images/Dicky.png'},{name:'Fayza Nadya',role:'Moderator · The Vectors',image:'/images/fayza.webp'}]});
events.push({...base,slug:'beyond-the-surface',title:'Beyond the Surface: Bypassing Defenses & Gaining Persistence',shortTitle:'Understand vulnerabilities. Build stronger defenses.',division:'The Cyphers',format:'Offline',kind:'Study jam',start:'2026-05-23T13:00:00+07:00',end:'2026-05-23T16:00:00+07:00',image:'/images/Pentest.png',description:'A community study jam on web application security with Yumansyah Nurnidar. Explore vulnerability analysis, security testing concepts, and secure coding practices in an educational workshop setting.',location:'Lab 1 · FTII UHAMKA Campus F, Ciracas',tags:['Web security','Penetration testing','Secure coding'],speakers:[{name:'Yumansyah Nurnidar',role:'Koordinator ACT Region Bekasi',image:'/images/Yumansyah.png'},{name:'Deeta Zamel Aulia',role:'Moderator · The Cyphers',image:'/images/deta.webp'}]});
write('src/content/events.json',events);
const home='src/components/home.tsx';let s=fs.readFileSync(home,'utf8');
const start=s.indexOf(' <div className="hero-art"');const end=s.indexOf('</section>',start);
if(start>=0)s=s.slice(0,start)+` <div className="editorial-hero-art"><div className="hero-photo-main"><Photo src="/images/CC3.webp" alt="DSC UHAMKA students learning together in a campus workshop" priority sizes="(max-width: 650px) 100vw, 50vw"/><span className="photo-location"><span className="tiny-dot"/> FROM OUR COMMUNITY · UHAMKA</span><div className="photo-story"><span>More than a classroom.</span><strong>A place to build your next chapter.</strong></div></div><div className="hero-photo-note"><span className="note-symbol"><Code2 size={24}/></span><div><strong>Learn it. Build it. Share it.</strong><p>Real projects. Real people. Real progress.</p></div><ArrowUpRight size={21}/></div><span className="editorial-caption">01 / THE THINGS WE BUILD TOGETHER</span></div>`+s.slice(end);
s=s.replace('Big ideas.<br/>Real connections.<br/><span className="soft-heading">Built together.</span>','Your next chapter.<br/>Built with code.<br/><span className="soft-heading">And community.</span>');
s=s.replace('<EventCard event={eventData[1] as Event}/>','<EventCard event={eventData[2] as Event}/>');
fs.writeFileSync(home,s);
let e=fs.readFileSync('src/components/events.tsx','utf8').replace('const filtered=events.filter','const filtered=[...events].sort((a,b)=>Date.parse(b.start)-Date.parse(a.start)).filter');
e=e.replace('<span className="red-dot"/>{event.division}', '<span className={`metric-dot ${event.division===\'The Pixels\'?\'red\':event.division===\'The Vectors\'?\'blue\':\'green\'}`}/>{event.division}');
fs.writeFileSync('src/components/events.tsx',e);
let validation=fs.readFileSync('scripts/validate-export.mjs','utf8').replace("'/divisions/','/team/','/faq/'","'/divisions/','/team/','/faq/','/events/data-storytelling-tableau/','/events/beyond-the-surface/'");fs.writeFileSync('scripts/validate-export.mjs',validation);
console.log('Updated Figma content, corrected team mapping, and retouched editorial homepage.');
