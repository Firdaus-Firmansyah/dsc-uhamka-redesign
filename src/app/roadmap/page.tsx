import Roadmap from '@/components/Roadmap';
import {PageHeading} from '@/components/ui/primitives';
import {pageMetadata} from '@/lib/metadata';
export const metadata=pageMetadata('Learning roadmap','roadmap');
export default function RoadmapPage(){return <section className="container page-content"><PageHeading eyebrow="A little curiosity. A clear next step." title="Make learning a journey.">A suggested learning path, at your own pace. These stages are a guide, not a scheduled community programme.</PageHeading><Roadmap/></section>}
