import { isSameOrigin, json, rateLimit, readMessage } from '@/lib/api';
import faq from '@/content/faq.json';
import events from '@/content/events.json';

export const maxDuration = 30;

const OUT_OF_SCOPE_DECLINE_MESSAGE =
  'Maaf, saya tidak berkenan untuk menjawab hal tersebut karena di luar ruang lingkup DSC UHAMKA dan ekosistem Google Developer. Panduan dan kegiatan kami berpatokan pada Google Developer.';

const SENSITIVE_OR_NEGATIVE_PATTERNS = [
  /porno/i,
  /bokep/i,
  /dewasa/i,
  /judi/i,
  /slot/i,
  /politik/i,
  /pilkada/i,
  /pemilu/i,
  /presiden/i,
  /menteri/i,
  /partai/i,
  /sara/i,
  /agama/i,
  /rasis/i,
  /pemerintah/i,
  /kpu/i,
  /dpr/i,
  /kampanye/i,
  /calon/i,
  /teror/i,
  /senjata/i,
  /kekerasan/i,
];

const SYSTEM_INSTRUCTION = `You are the official AI Assistant of DSC UHAMKA (Developer Student Clubs Universitas Muhammadiyah Prof. DR. HAMKA).
Answer concisely, helpfully, and politely in the visitor's language (default Indonesian).

Community Context & Knowledge:
1. About DSC UHAMKA:
   DSC UHAMKA is a student technology community at FTII (Fakultas Teknologi Industri dan Informatika) UHAMKA supported by Google Developers, focused on building real-world digital skills, collaboration, and learning by doing.
   Campus location: FTII Kampus E UHAMKA, Jl. Tanah Merdeka No.6, Ciracas, Jakarta Timur.
   Community Lead: Tiananmen Setyo Nugroho.

2. Core Divisions (3 divisions):
   • The Pixels: UI/UX & Creative Design (Figma, Design systems, UI research, 3D & motion design). Person in Charge (PIC): Firdaus Firmansyah.
   • The Vectors: Web & Mobile Engineering (React, Next.js, Flutter, TypeScript, Git & modern web architecture). Person in Charge (PIC): Salvalynda Riana Putri.
   • The Cyphers: Cloud, Security & IoT (Google Cloud Platform, Cyber Security, IoT, and Computer Networks). Person in Charge (PIC): Rafi Diandra.

3. Joining / Membership:
   Joining DSC UHAMKA is 100% FREE and open to all active UHAMKA students from any faculty and background. There is NO registration form! Students join directly by entering our official community channels:
   • Discord: [Komunitas Discord DSC UHAMKA](https://discord.com/invite/ew8JcEjr6D)
   • WhatsApp: [WhatsApp Community via Linktree](https://linktr.ee/gdsc.uhamka)

4. Official Social Media & Channels (ALWAYS use these exact Markdown links and handles when asked for info or contact):
   • Instagram: [@dsc.uhamka](https://www.instagram.com/dsc.uhamka/)
   • LinkedIn: [DSC UHAMKA](https://www.linkedin.com/company/dsc-uhamka)
   • Discord: [Komunitas Discord DSC UHAMKA](https://discord.com/invite/ew8JcEjr6D)
   • WhatsApp Community: [WhatsApp Community](https://linktr.ee/gdsc.uhamka)
   • YouTube: [@GDSCUhamka](https://www.youtube.com/@GDSCUhamka)
   • Official Email: [gdscuhamka@gmail.com](mailto:gdscuhamka@gmail.com)

5. Scope & Refusal Rule:
   You ONLY assist with questions regarding DSC UHAMKA, our 3 divisions, tech learning, events/workshops, and the Google Developer ecosystem.
   If the user asks about anything outside this scope (e.g. food recipes, politics, celebrities, exams/homework in unrelated subjects, religion, gambling, adult/explicit content, weapons, or negative topics), you MUST politely and firmly decline with this EXACT message:
   "${OUT_OF_SCOPE_DECLINE_MESSAGE}"

6. Public reference data:
${JSON.stringify({ faq, events: events.map(({ title, description, start, end, slug }) => ({ title, description, start, end, url: `/events/${slug}` })) })}
`;

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return json({ error: 'Request origin is not allowed.' }, 403);
  }

  let message: string;
  try {
    message = await readMessage(request);
  } catch {
    return json({ error: 'Send a JSON message between 1 and 2,000 characters (maximum body 8 KB).' }, 400);
  }

  const blocked = await rateLimit(request, 'chatbot', 10);
  if (blocked) return blocked;

  for (const pattern of SENSITIVE_OR_NEGATIVE_PATTERNS) {
    if (pattern.test(message)) {
      return json({ reply: OUT_OF_SCOPE_DECLINE_MESSAGE, source: 'ai' });
    }
  }

  const key = process.env.GEMINI_API_KEY;
  const rawModel = process.env.GEMINI_MODEL;
  const model = rawModel === 'gemini-2.5-flash' ? 'gemini-3.5-flash-lite' : (rawModel || 'gemini-3.5-flash-lite');

  if (!key || !model || !/^[a-zA-Z0-9.-]+$/.test(model)) {
    return json({ error: 'The assistant is temporarily unavailable. Please visit our FAQ.' }, 503);
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': key,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents: [{ role: 'user', parts: [{ text: message }] }],
        generationConfig: { maxOutputTokens: 800, temperature: 0.3 },
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) {
      return json(
        { error: response.status === 429 ? 'The assistant is busy. Try again shortly.' : 'The assistant could not respond. Please try again.' },
        response.status === 429 ? 429 : 502
      );
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];

    if (candidate?.finishReason && !['STOP', 'MAX_TOKENS'].includes(candidate.finishReason)) {
      return json({ error: 'Please rephrase your question about DSC UHAMKA.' }, 422);
    }

    const reply = candidate?.content?.parts
      ?.filter((p: { text?: string; thought?: boolean }) => typeof p.text === 'string' && !p.thought)
      ?.map((p: { text: string }) => p.text)
      ?.join('')
      ?.trim();

    if (!reply) throw new Error('empty');

    return json({ reply: reply.slice(0, 6000), source: 'ai' });
  } catch {
    return json({ error: 'The assistant is temporarily unavailable. Please try again.' }, 502);
  }
}
