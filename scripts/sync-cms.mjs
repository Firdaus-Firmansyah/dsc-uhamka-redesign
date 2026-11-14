import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import { createSign } from 'node:crypto';
import nextEnv from '@next/env';
import { parseRows } from './cms-schema.mjs';
nextEnv.loadEnvConfig(process.cwd());
async function main() {
  const sheet = process.env.GOOGLE_SHEET_ID;
  if (!sheet) {
    if (process.argv.includes('--if-configured') && process.env.CMS_SYNC_REQUIRED !== '1') { console.log('CMS not configured; using checked-in content.'); return; }
    throw new Error('Set GOOGLE_SHEET_ID and Google service account credentials.');
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(sheet)) throw new Error('Invalid sheet ID.');
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON || await readFile(process.env.GOOGLE_APPLICATION_CREDENTIALS || 'secrets/gsheets.json', 'utf8'));
  const encode = value => Buffer.from(JSON.stringify(value)).toString('base64url');
  const now = Math.floor(Date.now()/1000);
  const unsigned = `${encode({alg:'RS256',typ:'JWT'})}.${encode({iss:credentials.client_email,scope:'https://www.googleapis.com/auth/spreadsheets.readonly',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600})}`;
  const signature = createSign('RSA-SHA256').update(unsigned).sign(credentials.private_key, 'base64url');
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {method:'POST',body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion:`${unsigned}.${signature}`}),signal:AbortSignal.timeout(15000)});
  if (!tokenResponse.ok) throw new Error('Google authentication failed. Check service account configuration.');
  const {access_token} = await tokenResponse.json();
  const range = encodeURIComponent(process.env.GOOGLE_SHEET_RANGE || 'Content!A:D');
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheet}/values/${range}`, {headers:{Authorization:`Bearer ${access_token}`},signal:AbortSignal.timeout(15000)});
  if (!response.ok) throw new Error(`Sheet read failed (${response.status}). Share the sheet with the service account.`);
  const content = parseRows((await response.json()).values);
  if (!content.length) throw new Error('Refusing empty CMS snapshot.');
  // Generated files are isolated from curated events, FAQ and team data.
  await mkdir('src/content/cms', {recursive:true});
  for (const item of content) await writeFile(`src/content/cms/${item.slug}.json`, JSON.stringify(item,null,2)+'\n');
  // Only the validated, atomically replaced index is consumed by the website.
  await writeFile('src/content/cms-index.json.tmp', JSON.stringify(content,null,2)+'\n');
  await rename('src/content/cms-index.json.tmp','src/content/cms-index.json');
  console.log(`Synced ${content.length} pages from Google Sheets.`);
}
main().catch(error => { console.error(error.message?.startsWith('error:') ? 'CMS authentication failed.' : error.message); process.exitCode = 1; });
