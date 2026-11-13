import test from 'node:test';
import assert from 'node:assert/strict';
import {calendarUrl,eventStatus,formatTime,fuzzyMatch} from '../src/lib/events';
import type {Event} from '../src/types/event';
import data from '../src/content/events.json';
const event=data[0] as Event;
test('status changes at exact start/end boundaries',()=>{
 const start=Date.parse(event.start),end=Date.parse(event.end);
 assert.equal(eventStatus(event,start-1),'Open registration');
 assert.equal(eventStatus(event,start),'Happening now');
 assert.equal(eventStatus(event,end-1),'Happening now');
 assert.equal(eventStatus(event,end),'Completed');
 assert.equal(eventStatus({...event,registration:'waitlist'},start-1),'Waitlist');
 assert.equal(eventStatus({...event,registration:'closed'},start-1),'Registration closed');
});
test('calendar preserves Indonesia timezone and encodes event title',()=>{
 const url=new URL(calendarUrl(event));
 assert.equal(url.searchParams.get('dates'),'20260718T020000Z/20260718T040000Z');
 assert.equal(url.searchParams.get('text'),event.title);
 assert.equal(url.searchParams.get('ctz'),'Asia/Jakarta');
 assert.equal(formatTime(event.start),'09:00');
});
test('events without confirmed times use all-day calendar dates',()=>{
 const archived=data[1] as Event;
 assert.equal(new URL(calendarUrl(archived)).searchParams.get('dates'),'20250530/20250531');
});
test('search supports multiple words and a one-character typo',()=>{
 assert.ok(fuzzyMatch(event.title,'figma design'));
 assert.ok(fuzzyMatch(event.title,'figm'));
 assert.ok(fuzzyMatch(event.title,'figmma'));
 assert.ok(!fuzzyMatch(event.title,'cloud security'));
 assert.ok(fuzzyMatch(event.title,''));
});
test('published events have unique slugs, valid intervals and real registration URLs',()=>{
 assert.equal(new Set(data.map(e=>e.slug)).size,data.length);
 for(const e of data){assert.ok(Date.parse(e.start)<Date.parse(e.end));if(e.registrationUrl)assert.equal(new URL(e.registrationUrl).protocol,'https:');}
});
