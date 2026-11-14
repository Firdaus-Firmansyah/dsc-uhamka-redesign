import CertificateVerifier from '@/components/CertificateVerifier';
import {PageHeading} from '@/components/ui/primitives';
import {pageMetadata} from '@/lib/metadata';
export const metadata=pageMetadata('Certificate verification','certificates');
export default function CertificatesPage(){return <section className="container page-content"><PageHeading eyebrow="Your learning. Verified." title="Check your certificate.">Verify a DSC UHAMKA certificate using its unique ID.</PageHeading><CertificateVerifier/></section>}
