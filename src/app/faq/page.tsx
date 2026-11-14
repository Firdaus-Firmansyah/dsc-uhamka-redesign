import {pageMetadata} from '@/lib/metadata';
import {FAQ} from '@/components/faq';
import {PageHeading} from '@/components/ui/primitives';
export const metadata=pageMetadata('Frequently asked questions','faq');
export default function Page(){return <div className="container page-content"><PageHeading eyebrow="Good questions. Clear answers." title="A little less wondering.">Everything you need to know about joining, learning, and finding your place in the DSC UHAMKA community.</PageHeading><FAQ/></div>}
