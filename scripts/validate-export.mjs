import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const routes=['/','/events/','/events/mastering-figma-workflow/','/events/crash-course-uiux/','/divisions/','/team/','/faq/','/events/data-storytelling-tableau/','/events/beyond-the-surface/'];
let assets=0,links=0;
for(const route of routes){
 const file=path.join('out',route,'index.html');
 const html=await fs.readFile(file,'utf8');
 assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,`${route}: exactly one main heading`);
 assert.ok(html.includes('id="main"'),`${route}: skip-link target`);
 assert.ok(/<title>[^<]+<\/title>/.test(html),`${route}: page title`);
 for(const match of html.matchAll(/<(?:img|script|link)\b[^>]*>/g)){
  const tag=match[0];const url=tag.match(/(?:src|href)="([^"#]+)"/)?.[1];
  if(tag.startsWith('<img')){assert.ok(/\balt="/.test(tag),`${route}: alt attribute`);assert.ok(/\bwidth="\d+"/.test(tag)&&/\bheight="\d+"/.test(tag),`${route}: intrinsic image dimensions`)}
  if(url?.startsWith('/')){await fs.access(path.join('out',decodeURI(url.split('?')[0])));assets++;}
 }
 for(const match of html.matchAll(/<a\b[^>]*href="(\/[^"]*)"/g)){
  const target=match[1].split(/[?#]/)[0];
  await fs.access(path.join('out',target,target.endsWith('/')?'index.html':''));links++;
 }
 console.log(`PASS ${route}: headings, local assets, internal links, image dimensions`);
}
console.log(`Validated ${routes.length} static routes, ${assets} asset references, ${links} internal links.`);
