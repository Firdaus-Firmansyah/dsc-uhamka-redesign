import type { Metadata } from 'next';
import '@fontsource-variable/plus-jakarta-sans';
import '@fontsource-variable/inter';
import './globals.css';
import './retouch.css';
import './hero-logo.css';
import {Shell} from '@/components/layout/shell';
import {AmbientMotion} from '@/components/ui/ambient-motion';
export const metadata: Metadata={title:{default:'DSC UHAMKA — Learn. Build. Belong.',template:'%s | DSC UHAMKA'},description:'Bridge theory and real-world code with Developer Student Clubs UHAMKA. Explore community-led workshops, design, development, and cloud learning.',icons:{icon:'/images/Logo-Dsc-Uhamka-HD.png'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:`try{var t=localStorage.getItem('dsc-theme');document.documentElement.dataset.theme=t||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light')}catch(e){}`}}/></head><body><AmbientMotion/><Shell>{children}</Shell></body></html>}
