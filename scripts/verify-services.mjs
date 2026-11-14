import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const base=process.env.BASE_URL||'http://localhost:3000';
const browser=await chromium.launch();
const page=await browser.newPage();
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('console',m=>{if(m.type()==='error' && /Content Security Policy|Refused to|Hydration/i.test(m.text()))errors.push(m.text())});
try{
 const first=await page.goto(base+'/');
 assert.equal(first.status(),200);
 assert.equal(first.headers()['x-frame-options'],'DENY');
 const csp=first.headers()['content-security-policy'];assert.match(csp,/nonce-/);assert.doesNotMatch(csp,/unsafe-eval/);
 const nonce=await page.locator('script[nonce]').first().evaluate(el=>el.nonce);assert.ok(csp.includes(`'nonce-${nonce}'`));
 const next=await page.request.get(base+'/');assert.notEqual(next.headers()['content-security-policy'],csp);
 for(const route of ['/','/events','/events/mastering-figma-workflow','/roadmap','/certificates','/team','/faq','/divisions']){
  await page.goto(base+route);await page.waitForLoadState('networkidle');
  const og=await page.locator('meta[property="og:image"]').getAttribute('content');assert.ok(og.includes('/api/og/'));
  const image=await page.request.get(base+new URL(og,base).pathname);assert.equal(image.status(),200);assert.match(image.headers()['content-type'],/image\/png/);assert.ok((await image.body()).length>1000);
 }
 await page.goto(base+'/roadmap');await page.getByRole('button',{name:'completed',exact:true}).click();await page.getByText('No milestones with this status yet.').waitFor();
 await page.getByRole('button',{name:'all',exact:true}).click();await page.locator('summary').first().click();assert.equal(await page.locator('details[open]').count(),1);
 await mkdir('test-results',{recursive:true});await page.screenshot({path:'test-results/roadmap-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});
 await page.screenshot({path:'test-results/roadmap-mobile.png',fullPage:true});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.getByRole('button',{name:'Ask DSC'}).click();await page.getByLabel('Your question').fill('How do I join?');
 // Deterministic UI failure handling; provider success is covered separately with mocks.
 await page.route('**/api/chatbot',r=>r.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'The assistant is temporarily unavailable.'})}));
 await page.getByRole('button',{name:'Send question'}).click();await page.getByRole('alert').waitFor();await page.screenshot({path:'test-results/chat-mobile.png'});await page.keyboard.press('Escape');
 await page.goto(base+'/certificates');await page.getByLabel('Certificate ID').fill('b3856247-289c-46ed-a55f-3bd24b1782c0');
 await page.route('**/api/certificate/verify/*',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({valid:true,details:{id:'b3856247-289c-46ed-a55f-3bd24b1782c0',issued_at:'2026-01-01T00:00:00Z'}})}));
 await page.getByRole('button',{name:'Verify certificate',exact:true}).click();await page.getByText(/Verified certificate/).waitFor();
 const invalid=await page.request.get(base+'/api/certificate/verify/invalid');assert.equal(invalid.status(),400);
 const denied=await page.request.post(base+'/api/chatbot',{headers:{origin:'https://untrusted.test'},data:{message:'Hi'}});assert.equal(denied.status(),403);
 assert.deepEqual(errors,[]);console.log('PASS: security headers, fresh nonces, 8 route OG images, roadmap filters/details, mobile overflow, reduced motion, chat error UI, certificate UI, API validation, no CSP/hydration errors.');
}finally{await browser.close()}
