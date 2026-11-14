import {json,rateLimit,uuidPattern} from '@/lib/api';
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params;if(!uuidPattern.test(id))return json({valid:false,error:'Enter a valid certificate UUID.'},400);
 const blocked=await rateLimit(request,'certificate',30);if(blocked)return blocked;
 const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_ANON_KEY;
 if(!url||!key)return json({error:'Certificate verification is temporarily unavailable.'},503);
 try{
  const response=await fetch(`${url.replace(/\/$/,'')}/rest/v1/rpc/verify_certificate`,{method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({certificate_id:id}),cache:'no-store',signal:AbortSignal.timeout(8000)});
  if(!response.ok)throw new Error('database');
  const rows=await response.json();if(!Array.isArray(rows))throw new Error('response');
  const certificate=rows[0];if(!certificate)return json({valid:false,details:null});
  if(!uuidPattern.test(certificate.id)||!Number.isFinite(Date.parse(certificate.issued_at)))throw new Error('response');
  return json({valid:true,details:{id:certificate.id,issued_at:certificate.issued_at}});
 }catch{return json({error:'Could not verify the certificate. Please try again later.'},502)}
}
