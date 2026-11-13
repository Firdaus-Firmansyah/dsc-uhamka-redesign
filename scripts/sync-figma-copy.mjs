import fs from 'node:fs';
const path='src/content/faq.json';const faq=JSON.parse(fs.readFileSync(path,'utf8'));
faq[0].answer='Absolutely! DSC UHAMKA is open to active UHAMKA students from any major or faculty. Technology belongs to everyone who wants to learn.';
faq[2].answer='Yes, you can! Peer-to-peer learning is at the heart of DSC UHAMKA. Start with beginner-friendly sessions and grow alongside the community.';
faq[4].answer='Explore three focus areas: The Pixels (UI/UX & Creative), The Vectors (Web & Mobile Development), and The Cyphers (Cloud & Security). Choose what sparks your interest.';
faq[5].answer='Members attend events and workshops. The Core Team organizes activities and manages community operations. Watch our community channels for recruitment announcements.';
faq[7].answer='Certificate requirements depend on the event. Usually, participants need to register, attend the session, and complete the attendance or feedback form. Check the event announcement for details.';
faq[9].answer='We welcome collaborations! Send your proposal to gdscuhamka@gmail.com or contact @dsc.uhamka on Instagram.';
fs.writeFileSync(path,JSON.stringify(faq,null,2)+'\n');
const teamPath='src/content/team.json';const team=JSON.parse(fs.readFileSync(teamPath,'utf8'));
for(const m of team){m.bio=m.bio.replace(/\.\.$/,'.');for(const [key,url] of Object.entries(m.links)){if(url.includes('/settings/')||url.endsWith('/edit'))delete m.links[key];}}
fs.writeFileSync(teamPath,JSON.stringify(team,null,2)+'\n');
