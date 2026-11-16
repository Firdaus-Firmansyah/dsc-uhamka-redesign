import {createHash} from 'node:crypto';
export function json(body:unknown,status=200,headers:Record<string,string>={}){return Response.json(body,{status,headers:{'Cache-Control':'no-store',...headers}})}
export const uuidPattern=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function isSameOrigin(request: Request) {
  if (process.env.NODE_ENV !== 'production') return true;
  const origin = request.headers.get('origin');
  const siteUrl = process.env.SITE_URL;
  const requestOrigin = new URL(request.url).origin;
  if (!origin) return true;
  if (!siteUrl) return origin === requestOrigin;
  return origin === requestOrigin || origin === siteUrl;
}
export async function readMessage(request:Request){
 if(!request.headers.get('content-type')?.toLowerCase().startsWith('application/json'))throw new Error('content-type');
 const reader=request.body?.getReader();if(!reader)throw new Error('body');
 let length=0;const chunks:Uint8Array[]=[];
 try{while(true){const {done,value}=await reader.read();if(done)break;length+=value.byteLength;if(length>8192){await reader.cancel();throw new Error('size')}chunks.push(value)}}finally{reader.releaseLock()}
 const body=JSON.parse(Buffer.concat(chunks).toString('utf8'));
 if(!body||typeof body.message!=='string'||!body.message.trim()||body.message.trim().length>2000)throw new Error('message');
 return body.message.trim() as string;
}
// Shared Redis counters work across Vercel instances. Production fails closed if absent.
export async function rateLimit(request:Request,scope:string,limit:number):Promise<Response|null>{
 const url=process.env.UPSTASH_REDIS_REST_URL,token=process.env.UPSTASH_REDIS_REST_TOKEN;
 if(!url||!token)return null;
 const ip=request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim()||'unknown';
 const hash=createHash('sha256').update(ip).digest('hex').slice(0,24);
 const bucket=Math.floor(Date.now()/60000);const key=`dsc:${scope}:${hash}:${bucket}`;
 try{
  const response=await fetch(`${url.replace(/\/$/,'')}/pipeline`,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify([['INCR',key],['EXPIRE',key,120]]),cache:'no-store',signal:AbortSignal.timeout(4000)});
  if(!response.ok)throw new Error('redis');
  const result=await response.json();if(result.some((r:{error?:string})=>r.error)||typeof result[0]?.result!=='number')throw new Error('redis');
  return result[0].result>limit?json({error:'Too many requests. Try again in a minute.'},429,{'Retry-After':'60'}):null;
 }catch{return json({error:'Service temporarily unavailable.'},503)}
}
