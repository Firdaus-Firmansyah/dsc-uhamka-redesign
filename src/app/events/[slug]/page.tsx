import {pageMetadata} from '@/lib/metadata';
import {notFound} from 'next/navigation';
import {EventDetail} from '@/components/events';
import data from '@/content/events.json';
import type {Event} from '@/types/event';


export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const event=data.find(e=>e.slug===slug);return pageMetadata(event?.title||'Event not found',slug,event?.description)}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const event=data.find(e=>e.slug===slug);if(!event)notFound();return <EventDetail event={event as Event}/>}
