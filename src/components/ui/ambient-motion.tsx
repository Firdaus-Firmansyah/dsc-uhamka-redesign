'use client';

import {useEffect, useRef} from 'react';

/** Decorative viewport-sized flow field; always running in the background. */
export function AmbientMotion() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    document.documentElement.dataset.motionPaused = 'false';
  }, []);

  useEffect(() => {
    const visibility = () => {
      document.documentElement.dataset.pageHidden = String(document.hidden);
    };
    visibility();
    document.addEventListener('visibilitychange', visibility);
    return () => document.removeEventListener('visibilitychange', visibility);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', {alpha: true});
    if (!canvas || !context) return;

    let width = 0, height = 0, frame = 0, previous = 0, time = 0;
    let dark = document.documentElement.dataset.theme === 'dark';
    let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0;
    let particles: {x: number; y: number; depth: number; phase: number; color: string}[] = [];
    const colors = ['#4285f4', '#4285f4', '#4285f4', '#34a853', '#ea4335', '#fbbc04'];

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas!.width = Math.round(width * ratio);
      canvas!.height = Math.round(height * ratio);
      context!.setTransform(ratio, 0, 0, ratio, 0, 0);
      let seed = 43;
      const random = () => {
        seed = (seed * 16807) % 2147483647;
        return seed / 2147483647;
      };
      const count = Math.min(width < 700 ? 65 : 190, Math.round((width * height) / 5500));
      particles = Array.from({length: count}, () => ({
        x: random(),
        y: random(),
        depth: 0.25 + random() * 0.75,
        phase: random() * Math.PI * 2,
        color: colors[Math.floor(random() * colors.length)],
      }));
      draw();
    }

    function draw() {
      context!.clearRect(0, 0, width, height);
      context!.lineCap = 'round';
      for (const particle of particles) {
        const y =
          ((particle.y * height - time * (7 + particle.depth * 12)) % (height + 40) +
            height +
            40) %
            (height + 40) -
          20;
        const wave = Math.sin((y / Math.max(height, 1)) * 5 + particle.phase + time * 0.12);
        const x = particle.x * width + wave * 22 * particle.depth + pointerX * particle.depth;
        const py = y + pointerY * particle.depth;
        const angle = -0.5 * Math.PI + wave * 0.55 + ((x / Math.max(width, 1)) - 0.5) * 0.6;
        const length = 1.4 + particle.depth * 3.4;
        const edge = Math.min(1, Math.abs((x / Math.max(width, 1)) - 0.5) * 2.5);
        context!.globalAlpha = (dark ? 0.2 : 0.15) + edge * 0.25;
        context!.strokeStyle = particle.color;
        context!.lineWidth = 0.8 + particle.depth * 0.8;
        context!.beginPath();
        context!.moveTo(x, py);
        context!.lineTo(x + Math.cos(angle) * length, py + Math.sin(angle) * length);
        context!.stroke();
      }
      context!.globalAlpha = 1;
    }

    function animate(now: number) {
      frame = 0;
      if (document.hidden) return;
      if (now - previous >= 1000 / 30) {
        time += previous ? Math.min((now - previous) / 1000, 0.06) : 0;
        previous = now;
        pointerX += (targetX - pointerX) * 0.035;
        pointerY += (targetY - pointerY) * 0.035;
        draw();
      }
      frame = requestAnimationFrame(animate);
    }

    const visibility = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      if (!document.hidden) frame = requestAnimationFrame(animate);
    };

    const pointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      targetX = ((event.clientX / width) - 0.5) * 22;
      targetY = ((event.clientY / height) - 0.5) * 14;
    };

    const leave = () => {
      targetX = 0;
      targetY = 0;
    };

    const theme = new MutationObserver(() => {
      dark = document.documentElement.dataset.theme === 'dark';
      draw();
    });
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    resize();
    visibility();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', pointer, {passive: true});
    document.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', visibility);

    return () => {
      cancelAnimationFrame(frame);
      theme.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', pointer);
      document.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="ambient-motion" aria-hidden="true" />;
}
