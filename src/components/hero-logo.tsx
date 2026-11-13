import type {CSSProperties} from 'react';
import {Photo} from '@/components/ui/primitives';

export function HeroLogo() {
  return <div className="logo-hero" role="img" aria-label="DSC UHAMKA logo floating in three dimensions">
    <div className="logo-stage" aria-hidden="true">
      <div className="logo-aura"/>
      <div className="logo-orbit orbit-back"/>
      <div className="logo-sculpture">
        {Array.from({length:12}, (_,i)=><div key={i} className="logo-depth" style={{'--depth':`${-18+i*1.5}px`,'--shade':.52+i*.025} as CSSProperties}/>)}
        <div className="logo-face"><Photo src="/images/Logo-Dsc-Uhamka-HD.png" alt="" priority sizes="(max-width: 650px) 65vw, 340px"/></div>
      </div>
      <div className="logo-ground-shadow"/>
      <span className="logo-satellite satellite-blue"/><span className="logo-satellite satellite-green"/>
      <span className="logo-coordinate">DSC / UHAMKA</span>
    </div>
    <div className="logo-signature" aria-hidden="true"><span className="tiny-dot"/> Learn. Build. Belong.</div>
  </div>;
}
