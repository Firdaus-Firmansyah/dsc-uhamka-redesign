import {siteUrl, pageMetadata} from '@/lib/metadata';
import {headers} from 'next/headers';
import type { Metadata } from 'next';
import '@fontsource-variable/plus-jakarta-sans';
import '@fontsource-variable/inter';
import './globals.css';
import './retouch.css';
import './hero-logo.css';
import './features.css';
import {Shell} from '@/components/layout/shell';
import {AmbientMotion} from '@/components/ui/ambient-motion';
import InitScript from '@/components/InitScript';
export const dynamic = 'force-dynamic';
export const metadata: Metadata={...pageMetadata('DSC UHAMKA', 'home'),metadataBase:new URL(siteUrl),title:{default:'DSC UHAMKA — Learn. Build. Belong.',template:'%s | DSC UHAMKA'},description:'Bridge theory and real-world code with Developer Student Clubs UHAMKA. Explore community-led workshops, design, development, and cloud learning.',icons:{icon:'/images/Logo-Dsc-Uhamka-HD.png'}};
export default async function RootLayout({children}:{children:React.ReactNode}) {
  const nonce = (await headers()).get('x-nonce') ?? undefined;
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <InitScript nonce={nonce} />
        <AmbientMotion />
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
