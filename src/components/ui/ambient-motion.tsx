'use client';

import {useEffect, useRef, useState} from 'react';
import {Pause, Play} from 'lucide-react';

/** Decorative viewport-sized flow field; never intercepts content or pointer input. */
export function AmbientMotion() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    document.documentElement.dataset.motionPaused = String(paused || reduced);
  }, [paused, reduced]);

  useEffect(() => {
    const visibility = () => { document.documentElement.dataset.pageHidden = String(document.hidden); };
    visibility();
    document.addEventListener('visibilitychange', visibility);
    return () => document.removeEventListener('visibilitychange', visibility);
  }, []);

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(preference.matches);
    update();
    preference.addEventListener('change', update);
    try { setPaused(localStorage.getItem('dsc-motion-paused') === 'true'); } catch {}
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', {alpha: true});
    if (!canvas || !context) return;
    if (reduced) { context.clearRect(0, 0, canvas.width, canvas.height); return; }

    let width = 0, height = 0, frame = 0, previous = 0, time = 0;
    let dark = document.documentElement.dataset.theme === 'dark';
    let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0;
    let particles: {x: number; y: number; depth: number; phase: number; color: string}[] = [];
    const colors = ['#4285f4', '#4285f4', '#4285f4', '#34a853', '#ea4335', '#fbbc04'];
    // Seeded positions avoid a distracting random rearrangement when paused/resumed.
    function resize() {
      width = window.innerWidth; height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas!.width = Math.round(width * ratio); canvas!.height = Math.round(height * ratio);
      context!.setTransform(ratio, 0, 0, ratio, 0, 0);
      let seed = 43;
      const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
      const count = Math.min(width < 700 ? 65 : 190, Math.round(width * height / 5500));
      particles = Array.from({length: count}, () => ({x: random(), y: random(), depth: .25 + random() * .75, phase: random() * Math.PI * 2, color: colors[Math.floor(random() * colors.length)]}));
      draw();
    }
    function draw() {
      context!.clearRect(0, 0, width, height);
      context!.lineCap = 'round';
      for (const particle of particles) {
        const y = ((particle.y * height - time * (7 + particle.depth * 12)) % (height + 40) + height + 40) % (height + 40) - 20;
        const wave = Math.sin(y / Math.max(height, 1) * 5 + particle.phase + time * .12);
        const x = particle.x * width + wave * 22 * particle.depth + pointerX * particle.depth;
        const py = y + pointerY * particle.depth;
        const angle = -.5 * Math.PI + wave * .55 + (x / Math.max(width, 1) - .5) * .6;
        const length = 1.4 + particle.depth * 3.4;
        // Lower contrast in the central reading area; more visible around the edges.
        const edge = Math.min(1, Math.abs(x / Math.max(width, 1) - .5) * 2.5);
        context!.globalAlpha = (dark ? .2 : .15) + edge * .25;
        context!.strokeStyle = particle.color;
        context!.lineWidth = .8 + particle.depth * .8;
        context!.beginPath(); context!.moveTo(x, py);
        context!.lineTo(x + Math.cos(angle) * length, py + Math.sin(angle) * length);
        context!.stroke();
      }
      context!.globalAlpha = 1;
    }
    function animate(now: number) {
      frame = 0;
      if (document.hidden || paused) return;
      if (now - previous >= 1000 / 30) {
        time += previous ? Math.min((now - previous) / 1000, .06) : 0;
        previous = now;
        pointerX += (targetX - pointerX) * .035;
        pointerY += (targetY - pointerY) * .035;
        draw();
      }
      frame = requestAnimationFrame(animate);
    }
    const visibility = () => {
      cancelAnimationFrame(frame); frame = 0; previous = 0;
      if (!document.hidden && !paused) frame = requestAnimationFrame(animate);
    };
    const pointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      targetX = (event.clientX / width - .5) * 22;
      targetY = (event.clientY / height - .5) * 14;
    };
    const leave = () => { targetX = 0; targetY = 0; };
    const theme = new MutationObserver(() => { dark = document.documentElement.dataset.theme === 'dark'; draw(); });
    theme.observe(document.documentElement, {attributes: true, attributeFilter: ['data-theme']});
    resize(); visibility();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', pointer, {passive: true});
    document.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      cancelAnimationFrame(frame); theme.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', pointer);
      document.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [paused, reduced]);

  function toggle() {
    setPaused(value => {
      try { localStorage.setItem('dsc-motion-paused', String(!value)); } catch {}
      return !value;
    });
  }
  return <><canvas ref={canvasRef} className="ambient-motion" aria-hidden="true"/>{!reduced && <button type="button" className="motion-control" onClick={toggle} aria-label={paused ? 'Resume background motion' : 'Pause background motion'} title={paused ? 'Resume background motion' : 'Pause background motion'}>{paused ? <Play size={13}/> : <Pause size={13}/>}<span>Motion {paused ? 'off' : 'on'}</span></button>}</>;
}
