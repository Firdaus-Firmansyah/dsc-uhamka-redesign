import {test} from 'node:test';
import assert from 'node:assert/strict';
import {isSameOrigin,readMessage,rateLimit} from '../src/lib/api';
import {GET as verify} from '../src/app/api/certificate/verify/[id]/route';
import {POST as chat} from '../src/app/api/chatbot/route';
// JS schema is shared with the standalone sync CLI.
import {parseRows} from '../scripts/cms-schema.mjs';
const id='b3856247-289c-46ed-a55f-3bd24b1782c0';
test('CMS rejects traversal, duplicate slugs and missing columns',()=>{
 const header=['slug','title','description','content'];
 assert.throws(()=>parseRows([header,['../events','Title','Description','Text']]));
 assert.throws(()=>parseRows([header,['home','Title','Description','Text'],['home','Another','Description','Text']]));
 assert.throws(()=>parseRows([['slug'],['home']]));
 assert.equal(parseRows([header,['home','Title','Description','<script>plain text</script>']])[0].slug,'home');
});
test('chat validates origin, JSON, message size and actual body bytes',async()=>{
 assert.equal(isSameOrigin(new Request('https://site.test/api',{headers:{origin:'https://evil.test'}})),false);
 assert.equal(isSameOrigin(new Request('https://site.test/api',{headers:{origin:'https://site.test'}})),true);
 for(const body of ['null','{}',JSON.stringify({message:'x'.repeat(2001)}),JSON.stringify({message:'ok',extra:'x'.repeat(9000)})]){
  await assert.rejects(()=>readMessage(new Request('https://site.test/api',{method:'POST',headers:{'content-type':'application/json'},body})));
 }
 assert.equal((await chat(new Request('https://site.test/api',{method:'POST',headers:{origin:'https://evil.test'}}))).status,403);
});
test('certificate returns minimal public details, invalid and unavailable states; rate limiter fails closed',async()=>{
 const originalFetch=globalThis.fetch;const env={...process.env};
 try{
  Object.assign(process.env,{NODE_ENV:'production',SUPABASE_URL:'https://db.test',SUPABASE_ANON_KEY:'test',UPSTASH_REDIS_REST_URL:'https://redis.test',UPSTASH_REDIS_REST_TOKEN:'test'});
  const req=new Request('https://site.test/api');
  assert.equal((await verify(req,{params:Promise.resolve({id:'bad'})})).status,400);
  globalThis.fetch=async(input)=>String(input).includes('redis.test')?Response.json([{result:1},{result:1}]):Response.json([{id,issued_at:'2026-01-01T00:00:00Z',user_email:'private@example.test'}]);
  const valid=await verify(req,{params:Promise.resolve({id})});assert.deepEqual(await valid.json(),{valid:true,details:{id,issued_at:'2026-01-01T00:00:00Z'}});
  globalThis.fetch=async(input)=>String(input).includes('redis.test')?Response.json([{result:1},{result:1}]):Response.json([]);
  assert.deepEqual(await (await verify(req,{params:Promise.resolve({id})})).json(),{valid:false,details:null});
  globalThis.fetch=async()=>Response.json([{result:31},{result:1}]);assert.equal((await rateLimit(req,'certificate',30))?.status,429);
  globalThis.fetch=async()=>{throw new Error('offline')};assert.equal((await rateLimit(req,'certificate',30))?.status,503);
  delete process.env.UPSTASH_REDIS_REST_TOKEN;assert.equal((await rateLimit(req,'certificate',30))?.status,503);
 }finally{globalThis.fetch=originalFetch;process.env=env}
});
test('Gemini request succeeds through server-only fetch and handles provider failure',async()=>{
 const originalFetch=globalThis.fetch;const env={...process.env};
 try{
  Object.assign(process.env,{NODE_ENV:'production',GEMINI_API_KEY:'test-secret',GEMINI_MODEL:'test-model',UPSTASH_REDIS_REST_URL:'https://redis.test',UPSTASH_REDIS_REST_TOKEN:'test'});
  const req=()=>new Request('https://site.test/api/chatbot',{method:'POST',headers:{origin:'https://site.test','content-type':'application/json'},body:JSON.stringify({message:'How do I join?'})});
  globalThis.fetch=async(input,init)=>{if(String(input).includes('redis.test'))return Response.json([{result:1},{result:1}]);assert.equal((init?.headers as Record<string,string>)['x-goog-api-key'],'test-secret');assert.match(String(init?.body),/systemInstruction/);return Response.json({candidates:[{finishReason:'STOP',content:{parts:[{text:'Visit our community links.'}]}}]})};
  assert.deepEqual(await (await chat(req())).json(),{reply:'Visit our community links.',source:'ai'});
  globalThis.fetch=async(input)=>String(input).includes('redis.test')?Response.json([{result:1},{result:1}]):new Response('private provider error',{status:500});
  const error=await chat(req());assert.equal(error.status,502);assert.doesNotMatch(await error.text(),/private provider/);
 }finally{globalThis.fetch=originalFetch;process.env=env}
});
