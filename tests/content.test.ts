import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import team from '../src/content/team.json';
import events from '../src/content/events.json';
import assets from '../src/content/assets.json';
const manifest=assets as Record<string,{src:string;width:number;height:number;blur:string}>;
test('all team, event, speaker and gallery images have optimized local assets',()=>{
 const paths=[...team.map(m=>m.image),...events.flatMap(e=>[e.image,...e.speakers.map(s=>s.image),...e.gallery]),'/images/Tiananmen.webp'];
 for(const image of paths){assert.ok(manifest[image],image);assert.ok(existsSync(`public${manifest[image].src}`),image);assert.ok(manifest[image].width>0&&manifest[image].height>0);}
});
test('Deeta and Regissya have distinct names and portraits; no settings URLs are exposed',()=>{
 assert.equal(team.find(m=>m.image==='/images/deta.webp')?.name,'Deeta Zamel Aulia');
 assert.equal(team.find(m=>m.image==='/images/regis.webp')?.name,'Regissya Anfieldasari F. A.');
 assert.equal(new Set(team.map(m=>m.name)).size,team.length);
 for(const member of team)for(const url of Object.values(member.links))assert.ok(!/\/settings\/|\/edit$/.test(url));
});
test('each division has a real event in the imported archive',()=>{
 for(const division of ['The Pixels','The Vectors','The Cyphers'])assert.ok(events.some(e=>e.division===division));
});
