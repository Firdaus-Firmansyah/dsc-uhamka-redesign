import type { Event } from '@/types/event';
export const CONTENT_DATE = '2026-11-13T00:00:00+07:00';
export function eventStatus(event: Pick<Event,'start'|'end'|'registration'>, now: number = Date.now()) {
  if (now >= Date.parse(event.end)) return 'Completed';
  if (now >= Date.parse(event.start)) return 'Happening now';
  return event.registration === 'waitlist' ? 'Waitlist' : event.registration === 'closed' ? 'Registration closed' : 'Open registration';
}
export function calendarUrl(event: Event) {
  const date = (s: string) => event.dateOnly ? s.slice(0,10).replace(/-/g,'') : new Date(s).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  return 'https://calendar.google.com/calendar/render?' + new URLSearchParams({action:'TEMPLATE',text:event.title,dates:`${date(event.start)}/${date(event.end)}`,details:event.description,location:event.location,ctz:'Asia/Jakarta'}).toString();
}
export function formatDate(value: string) { return new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Jakarta'}).format(new Date(value)); }
export function formatTime(value: string) { return new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Asia/Jakarta'}).format(new Date(value)); }
export function fuzzyMatch(text: string, query: string) {
  const clean=(s:string)=>s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9\s]/g,'');
  const target=clean(text); const words=target.split(/\s+/);
  return clean(query).trim().split(/\s+/).every(term=>target.includes(term)||words.some(word=>{
    if(term.length<4 || Math.abs(word.length-term.length)>1) return false;
    const d=Array.from({length:term.length+1},(_,i)=>Array.from({length:word.length+1},(_,j)=>i===0?j:j===0?i:0));
    for(let i=1;i<=term.length;i++) for(let j=1;j<=word.length;j++) d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(term[i-1]===word[j-1]?0:1));
    return d[term.length][word.length]<=1;
  }));
}
