import {pageMetadata} from '@/lib/metadata';
import {PageHeading} from '@/components/ui/primitives';
import {EventsHub} from '@/components/events';
import data from '@/content/events.json';
import type {Event} from '@/types/event';
export const metadata=pageMetadata('Events & study jams','events');
export default function Page(){return <div className="container page-content"><PageHeading eyebrow="Make room for a little discovery" title="Events & study jams.">Big ideas start with showing up. Find your next workshop, explore past sessions, and learn something worth sharing.</PageHeading><EventsHub events={data as Event[]}/></div>}
