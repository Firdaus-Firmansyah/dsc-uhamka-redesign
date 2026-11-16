// src/components/InitScript.tsx
'use client';

import { useEffect } from 'react';

type Props = { nonce?: string };

export default function InitScript({ nonce }: Props) {
  useEffect(() => {
    // Theme handling (localStorage / prefers‑color‑scheme)
    try {
      const stored = localStorage.getItem('dsc-theme');
      const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = stored ?? (prefersDark ? 'dark' : 'light');
      document.documentElement.dataset.theme = theme;
    } catch (e) {
      // ignore errors in browsers that block storage
    }

    // Inject a CSP‑nonce script if a nonce was provided by the server
    if (nonce) {
      const s = document.createElement('script');
      s.setAttribute('nonce', nonce);
      // script body is intentionally empty – we just need the nonce for CSP
      document.head.appendChild(s);
    }
  }, [nonce]);

  return null;
}

