import {notFound} from 'next/navigation';
import {EventDetail} from '@/components/events';
import data from '@/content/events.json';
import type {Event} from '@/types/event';
export const dynamicParams=false;
export function generateStaticParams(){return data.map(e=>({slug:e.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const event=data.find(e=>e.slug===slug);return {title:event?.title||'Event not found',description:event?.description}}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const event=data.find(e=>e.slug===slug);if(!event)notFound();return <EventDetail event={event as Event}/>}
