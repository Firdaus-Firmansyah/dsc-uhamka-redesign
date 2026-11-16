'use client';
import { useState, type FormEvent } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

type Message = { role: 'You' | 'Assistant'; text: string };

function FormattedContent({ text }: { text: string }) {
  // Regex to match markdown links [label](url), bare URLs (https?://...), and **bold**
  const regex = /(\[[^\]]+\]\((?:https?:\/\/|mailto:)[^\s)]+\)|(?:https?:\/\/|mailto:)[^\s)]+|\*\*[^*]+\*\*)/g;
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, idx) => {
        const mdMatch = part.match(/^\[([^\]]+)\]\(((?:https?:\/\/|mailto:)[^\s)]+)\)$/);
        if (mdMatch) {
          return (
            <a
              key={idx}
              href={mdMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--blue, #1a73e8)',
                textDecoration: 'underline',
                fontWeight: 600,
                wordBreak: 'break-word',
              }}
            >
              {mdMatch[1]}
            </a>
          );
        }
        if (part.startsWith('http://') || part.startsWith('https://') || part.startsWith('mailto:')) {
          return (
            <a
              key={idx}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--blue, #1a73e8)',
                textDecoration: 'underline',
                fontWeight: 600,
                wordBreak: 'break-word',
              }}
            >
              {part}
            </a>
          );
        }
        const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
        if (boldMatch) {
          return <strong key={idx}>{boldMatch[1]}</strong>;
        }
        return part;
      })}
    </>
  );
}

export default function ChatbotWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function send(event: FormEvent) {
    event.preventDefault();
    if (busy || !input.trim()) return;
    const message = input.trim();
    setInput('');
    setBusy(true);
    setError('');
    setMessages((m) => [...m.slice(-18), { role: 'You', text: message }]);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
        signal: AbortSignal.timeout(25000),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Assistant unavailable.');
      setMessages((m) => [...m, { role: 'Assistant', text: data.reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Assistant unavailable.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="button primary chat-trigger">
        Ask DSC <span aria-hidden="true">↗</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content chat-panel">
          <Dialog.Close className="icon-button dialog-close" aria-label="Close assistant">
            ×
          </Dialog.Close>
          <span className="eyebrow">A little help finding your way</span>
          <Dialog.Title>Ask DSC.</Dialog.Title>
          <Dialog.Description>
            AI answers about our community. Each question is sent to Google Gemini; avoid personal information. Answers may be inaccurate.
          </Dialog.Description>
          <div className="chat-messages" role="log" aria-live="polite" aria-label="Conversation">
            {!messages.length && <p>Curious about joining, events, or where to start?</p>}
            {messages.map((m, i) => (
              <div className={`chat-message ${m.role === 'You' ? 'from-you' : ''}`} key={i}>
                <strong>{m.role}</strong>
                <p>
                  <FormattedContent text={m.text} />
                </p>
              </div>
            ))}
            {busy && <p role="status">Thinking…</p>}
          </div>
          {error && (
            <p role="alert">
              {error} <a href="/faq">Visit FAQ</a>
            </p>
          )}
          <form className="service-form" onSubmit={send}>
            <label htmlFor="chat-question">Your question</label>
            <input
              id="chat-question"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={2000}
              required
              placeholder="How do I join?"
              disabled={busy}
            />
            <div className="chat-actions">
              <button className="button primary" disabled={busy || !input.trim()}>
                Send question
              </button>
              <button
                type="button"
                className="button secondary"
                disabled={busy}
                onClick={() => {
                  setMessages([]);
                  setError('');
                }}
              >
                Clear chat
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
