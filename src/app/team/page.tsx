import {Team} from '@/components/team';
import {PageHeading} from '@/components/ui/primitives';
import members from '@/content/team.json';
import type {Member} from '@/types/member';
export const metadata={title:'Meet the team'};
export default function Page(){return <div className="container page-content"><PageHeading eyebrow="The people behind the possibilities" title="A community, by its people.">Meet the students who make the study jams happen, keep the ideas flowing, and help everyone feel at home.</PageHeading><Team members={members as Member[]}/></div>}
