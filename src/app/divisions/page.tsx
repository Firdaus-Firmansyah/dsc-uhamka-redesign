import {pageMetadata} from '@/lib/metadata';
import {PageHeading} from '@/components/ui/primitives';
import {DivisionTabs} from '@/components/divisions';
import {JoinButton} from '@/components/layout/shell';
export const metadata=pageMetadata('Our divisions','divisions');
export default function Page(){return <div className="container page-content"><PageHeading eyebrow="Three paths. One community." title="Find your kind of building.">Design thoughtful experiences, engineer working products, or explore the systems that connect everything.</PageHeading><DivisionTabs/><section className="help-card"><div><h2>Not sure where to start?</h2><p>You don’t need to have it all figured out. Come meet the community and explore what sparks your curiosity.</p></div><JoinButton>Let’s figure it out together</JoinButton></section></div>}
