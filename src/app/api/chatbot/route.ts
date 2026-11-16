// src/app/api/chatbot/route.ts
import { isSameOrigin, json, rateLimit } from '@/lib/api';
import faq from '@/content/faq.json';
import events from '@/content/events.json';

export const maxDuration = 30;

// Official DSC UHAMKA social media & community backlinks
const OFFICIAL_LINKS = {
  instagram: {
    handle: '@dsc.uhamka',
    url: 'https://www.instagram.com/dsc.uhamka/',
  },
  linkedin: {
    name: 'DSC UHAMKA',
    url: 'https://www.linkedin.com/company/dsc-uhamka',
  },
  discord: {
    name: 'Komunitas Discord DSC UHAMKA',
    url: 'https://discord.com/invite/ew8JcEjr6D',
  },
  whatsapp: {
    name: 'WhatsApp Community via Linktree',
    url: 'https://linktr.ee/gdsc.uhamka',
  },
  email: 'gdscuhamka@gmail.com',
};

// Standard Out-of-Scope refusal message
const OUT_OF_SCOPE_DECLINE_MESSAGE =
  'Maaf, saya tidak berkenan untuk menjawab hal tersebut karena di luar ruang lingkup DSC UHAMKA dan ekosistem Google Developer. Panduan dan kegiatan kami berpatokan pada Google Developer.';

// Policy / Safety filter
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

// Rich, beautifully formatted responses for core DSC UHAMKA topics
const ANSWER_INFO_LEBIH_LANJUT = `Untuk mengetahui informasi lebih lanjut, pengumuman terbaru, dan update kegiatan DSC UHAMKA, Anda dapat mengunjungi kanal resmi kami berikut:

• **Instagram**: [${OFFICIAL_LINKS.instagram.handle}](${OFFICIAL_LINKS.instagram.url})
• **LinkedIn**: [${OFFICIAL_LINKS.linkedin.name}](${OFFICIAL_LINKS.linkedin.url})
• **Discord**: [${OFFICIAL_LINKS.discord.name}](${OFFICIAL_LINKS.discord.url})
• **WhatsApp Community**: [${OFFICIAL_LINKS.whatsapp.name}](${OFFICIAL_LINKS.whatsapp.url})
• **Email**: [${OFFICIAL_LINKS.email}](mailto:${OFFICIAL_LINKS.email})

Jangan ragu untuk mengikuti akun kami agar tidak ketinggalan info workshop dan event menarik!`;

const ANSWER_CARA_JOIN = `Bergabung menjadi member DSC UHAMKA sangat mudah dan **100% Gratis**! Anda tidak perlu mengisi formulir pendaftaran apa pun.

Cukup langsung masuk ke kanal komunitas resmi kami:
• **Discord**: [${OFFICIAL_LINKS.discord.name}](${OFFICIAL_LINKS.discord.url}) — Tempat utama untuk berdiskusi, bertanya teknis, dan koordinasi study jam.
• **WhatsApp Community**: [${OFFICIAL_LINKS.whatsapp.name}](${OFFICIAL_LINKS.whatsapp.url}) — Informasi pengumuman grup WhatsApp.

Seluruh mahasiswa aktif UHAMKA dari semua fakultas dan jurusan dipersilakan bergabung, baik pemula maupun yang sudah mahir!`;

const ANSWER_SEMUA_DIVISI = `DSC UHAMKA memiliki **3 divisi pembelajaran utama** (Three paths. One community):

1. **The Pixels** (Design & Experience / UI/UX & Creative)
   • Fokus: Belajar UI/UX Design, Design Systems, riset pengguna, prototyping, dan 3D/Motion.
   • Tools: Figma, UI/UX, Design Systems, 3D & motion.
   • PIC: Firdaus Firmansyah.

2. **The Vectors** (Web & Mobile Engineering)
   • Fokus: Belajar pemrograman dari baris pertama hingga membangun aplikasi web dan mobile yang fungsional.
   • Tools: React, Flutter, JavaScript/TypeScript, Git.
   • PIC: Salvalynda Riana Putri.

3. **The Cyphers** (Cloud, Security & IoT)
   • Fokus: Memahami infrastruktur cloud, jaringan aman, sistem terhubung, dan Internet of Things (IoT).
   • Tools: Google Cloud Platform (GCP), Jaringan, Cybersecurity, IoT.
   • PIC: Rafi Diandra.

Anda bebas memilih dan mengeksplorasi divisi mana pun yang sesuai dengan minat Anda!`;

const ANSWER_THE_PIXELS = `**Divisi The Pixels** adalah jalur pembelajaran di DSC UHAMKA yang berfokus pada **Design & Experience (UI/UX & Creative)**.

• **Tagline**: *"Design with intention."*
• **Yang dipelajari**: Mengubah ide kompleks menjadi antarmuka (interface) yang intuitif dan menarik. Mulai dari user research, merancang wireframe & prototype, hingga membangun design system yang konsisten.
• **Tools yang digunakan**: Figma, UI/UX principles, Design systems, serta 3D & motion.
• **PIC Divisi**: Firdaus Firmansyah.

Sangat cocok bagi Anda yang tertarik di bidang desain produk digital dan estetika visual!`;

const ANSWER_THE_VECTORS = `**Divisi The Vectors** adalah jalur pembelajaran di DSC UHAMKA yang berfokus pada **Web & Mobile Engineering**.

• **Tagline**: *"Make your ideas work."*
• **Yang dipelajari**: Membangun aplikasi web dan mobile yang nyata dari nol. Anda akan belajar menghubungkan interface dengan database, mengelola state, dan mengembangkan solusi digital yang bermanfaat.
• **Teknologi & Tools**: React, Flutter, JavaScript, TypeScript, Git, dan REST API.
• **PIC Divisi**: Salvalynda Riana Putri.

Sangat cocok bagi Anda yang ingin menjadi Frontend Developer, Mobile App Developer, atau Fullstack Engineer!`;

const ANSWER_THE_CYPHERS = `**Divisi The Cyphers** adalah jalur pembelajaran di DSC UHAMKA yang berfokus pada **Cloud, Security & IoT (Build beyond the screen)**.

• **Tagline**: *"Build beyond the screen."*
• **Yang dipelajari**: Memahami sistem di balik produk teknologi hebat. Belajar tentang infrastruktur cloud yang tangguh, keamanan siber (cybersecurity), jaringan, serta perangkat Internet of Things (IoT).
• **Teknologi & Tools**: Google Cloud Platform (GCP), Network fundamentals, Cybersecurity, IoT hardware & sensors.
• **PIC Divisi**: Rafi Diandra.

Sangat cocok bagi Anda yang tertarik dengan Cloud Computing, DevOps, Keamanan Sistem, dan IoT!`;

const ANSWER_LOKASI_FTII = `Kampus **FTII UHAMKA (Fakultas Teknologi Industri dan Informatika)** berlokasi di:

📍 **Kampus E UHAMKA**
Jl. Tanah Merdeka No.6, RT.11/RW.2, Rambutan, Kec. Ciracas, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13830.

Kampus ini menjadi pusat kegiatan perkuliahan teknologi dan kegiatan luring DSC UHAMKA.`;

const ANSWER_APA_ITU_DSC = `**DSC UHAMKA (Developer Student Clubs Universitas Muhammadiyah Prof. DR. HAMKA)** adalah komunitas mahasiswa yang didukung secara resmi oleh Google Developers. 

Tujuan utama kami adalah:
• Menjembatani kesenjangan antara teori akademis di kampus dengan praktik teknologi di dunia industri.
• Menyediakan wadah belajar bersama (peer-to-peer learning) seputar teknologi Google (Web, Android, Cloud, AI).
• Mengembangkan proyek nyata untuk memecahkan masalah di lingkungan sekitar melalui program seperti Google Solution Challenge.`;

const ANSWER_APA_ITU_UHAMKA = `**UHAMKA (Universitas Muhammadiyah Prof. DR. HAMKA)** adalah salah satu perguruan tinggi swasta Islam terkemuka di Indonesia yang terakreditasi Unggul. 

UHAMKA menyelenggarakan berbagai jenjang program studi di berbagai bidang keilmuan, teknologi, keguruan, kesehatan, farmasi, dan ekonomi dengan berlandaskan nilai-nilai Al-Islam dan Kemuhammadiyahan.`;

const ANSWER_APA_ITU_FTII = `**FTII UHAMKA (Fakultas Teknologi Industri dan Informatika)** adalah fakultas di Universitas Muhammadiyah Prof. DR. HAMKA yang menyelenggarakan program studi di bidang rekayasa teknologi, teknik industri, dan informatika. FTII berfokus mencetak lulusan berdaya saing global yang menguasai inovasi teknologi digital.`;

const ANSWER_NON_IT = `**Tentu saja bisa!** DSC UHAMKA terbuka untuk **seluruh mahasiswa aktif UHAMKA dari fakultas atau jurusan apa pun** (tidak terbatas hanya untuk mahasiswa IT atau Teknik). 

Teknologi adalah milik semua orang yang memiliki rasa ingin tahu dan semangat untuk belajar. Anda bisa langsung bergabung melalui Discord dan WhatsApp Community kami!`;

const ANSWER_PEMULA_CODING = `**Bisa sekali!** Anda tidak perlu memiliki pengalaman coding sebelumnya untuk bergabung. 

DSC UHAMKA mengusung konsep *peer-to-peer learning*, di mana kita belajar bersama dari dasar melalui sesi ramah pemula, study jam, dan mentoring rekan sebaya. Jangan ragu untuk bergabung!`;

const ANSWER_BIAYA = `Pendaftaran dan keanggotaan di DSC UHAMKA **100% GRATIS**. 
Tidak ada biaya pendaftaran maupun iuran keanggotaan bulanan. Anda cukup bergabung langsung ke Discord dan WhatsApp Community resmi kami.`;

const ANSWER_SERTIFIKAT = `Ya, setiap peserta yang mengikuti workshop atau acara yang diadakan oleh DSC UHAMKA dan memenuhi syarat kehadiran/feedback akan mendapatkan **e-certificate resmi** yang didukung oleh komunitas Google Developers. Sertifikat ini sangat berguna untuk portofolio Anda.`;

const ANSWER_LEAD_TEAM = `DSC UHAMKA dipimpin oleh **Tiananmen Setyo Nugroho** sebagai *DSC UHAMKA Lead*. 

Kepengurusan DSC UHAMKA didukung oleh Core Team yang mengelola divisi:
• **Core Board & Secretary**: Adinda Wulandari
• **The Pixels (Design)**: Firdaus Firmansyah
• **The Vectors (Engineering)**: Salvalynda Riana Putri
• **The Cyphers (Cloud & Security)**: Rafi Diandra
• **Event & PR**: Bingah Mahcha Hanifa, dkk.`;

const ANSWER_KOLABORASI = `DSC UHAMKA sangat terbuka untuk kerja sama dan kolaborasi, baik berupa event partnership, sponsorship, media partner, maupun workshop bersama!

Silakan kirim proposal atau tawaran kolaborasi ke:
• Email: [${OFFICIAL_LINKS.email}](mailto:${OFFICIAL_LINKS.email})
• Instagram: [${OFFICIAL_LINKS.instagram.handle}](${OFFICIAL_LINKS.instagram.url})`;

// Intelligent local knowledge pattern matcher with priority order
function matchLocalKnowledge(text: string): string | null {
  const q = text.toLowerCase().trim();

  // 1. Division: specific The Pixels
  if (
    q.includes('the pixel') ||
    q.includes('the pixels') ||
    q.includes('pixel') ||
    q.includes('pixels') ||
    q.includes('ui/ux') ||
    q.includes('ui ux') ||
    (q.includes('desain') && !q.includes('web')) ||
    q.includes('figma')
  ) {
    return ANSWER_THE_PIXELS;
  }

  // 2. Division: specific The Vectors
  if (
    q.includes('the vector') ||
    q.includes('the vectors') ||
    q.includes('vector') ||
    q.includes('vectors') ||
    q.includes('flutter') ||
    q.includes('react') ||
    q.includes('frontend') ||
    q.includes('backend') ||
    q.includes('mobile dev') ||
    q.includes('web dev')
  ) {
    return ANSWER_THE_VECTORS;
  }

  // 3. Division: specific The Cyphers
  if (
    q.includes('the cypher') ||
    q.includes('the cyphers') ||
    q.includes('cypher') ||
    q.includes('cyphers') ||
    q.includes('cyber') ||
    q.includes('keamanan') ||
    q.includes('security') ||
    q.includes('jaringan') ||
    q.includes('iot') ||
    (q.includes('cloud') && !q.includes('apa itu dsc'))
  ) {
    return ANSWER_THE_CYPHERS;
  }

  // 4. Division: General (Ada berapa divisi, apa saja divisi, pembagian divisi, list divisi)
  if (
    q.includes('divisi') ||
    q.includes('division') ||
    q.includes('jalur belajar') ||
    q.includes('fokus area')
  ) {
    return ANSWER_SEMUA_DIVISI;
  }

  // 5. Non-IT / Jurusan lain (Checked BEFORE join/gabung to prioritize specific intent)
  if (
    q.includes('non it') ||
    q.includes('non-it') ||
    q.includes('bukan it') ||
    q.includes('jurusan lain') ||
    q.includes('semua jurusan') ||
    q.includes('luar it')
  ) {
    return ANSWER_NON_IT;
  }

  // 6. Belum bisa coding / Pemula
  if (
    q.includes('belum bisa coding') ||
    q.includes('tidak bisa coding') ||
    q.includes('gak bisa coding') ||
    q.includes('pemula') ||
    q.includes('bisa ngoding') ||
    q.includes('bisa coding')
  ) {
    return ANSWER_PEMULA_CODING;
  }

  // 7. Biaya / Bayar / Gratis
  if (
    q.includes('biaya') ||
    q.includes('bayar') ||
    q.includes('gratis') ||
    q.includes('tarif') ||
    q.includes('free')
  ) {
    return ANSWER_BIAYA;
  }

  // 8. Sertifikat
  if (q.includes('sertifikat') || q.includes('certificate')) {
    return ANSWER_SERTIFIKAT;
  }

  // 9. Lead / Ketua / Core Team
  if (
    q.includes('lead') ||
    q.includes('ketua') ||
    q.includes('tiananmen') ||
    q.includes('pengurus') ||
    q.includes('core team')
  ) {
    return ANSWER_LEAD_TEAM;
  }

  // 10. Kolaborasi / Partnership
  if (
    q.includes('kolaborasi') ||
    q.includes('kerjasama') ||
    q.includes('kerja sama') ||
    q.includes('partner') ||
    q.includes('sponsor')
  ) {
    return ANSWER_KOLABORASI;
  }

  // 11. Info Lebih Lanjut / Social Media / Kontak
  if (
    q.includes('info lebih lanjut') ||
    q.includes('informasi lebih lanjut') ||
    q.includes('sosmed') ||
    q.includes('sosial media') ||
    q.includes('instagram') ||
    q.includes('linkedin') ||
    q.includes('media sosial') ||
    q.includes('kontak') ||
    q.includes('hubungi') ||
    q.includes('linktree') ||
    q.includes('email dsc')
  ) {
    return ANSWER_INFO_LEBIH_LANJUT;
  }

  // 12. Join / Gabung / Member / Pendaftaran
  if (
    q.includes('join') ||
    q.includes('gabung') ||
    q.includes('daftar') ||
    q.includes('member') ||
    q.includes('anggota') ||
    q.includes('registrasi') ||
    q.includes('masuk dsc') ||
    q.includes('cara ikut')
  ) {
    return ANSWER_CARA_JOIN;
  }

  // 13. Lokasi Kampus / FTII / Alamat
  if (
    q.includes('lokasi') ||
    q.includes('alamat') ||
    q.includes('dimana') ||
    q.includes('kampus e') ||
    q.includes('ciracas')
  ) {
    return ANSWER_LOKASI_FTII;
  }

  // 14. Apa itu FTII UHAMKA
  if (q.includes('apa itu ftii') || q.includes('tentang ftii')) {
    return ANSWER_APA_ITU_FTII;
  }

  // 15. Apa itu UHAMKA
  if (
    q === 'apa itu uhamka' ||
    q === 'apa itu uhamka?' ||
    q.includes('tentang uhamka') ||
    q.includes('profil uhamka')
  ) {
    return ANSWER_APA_ITU_UHAMKA;
  }

  // 16. Apa itu DSC UHAMKA
  if (
    q.includes('apa itu dsc') ||
    q.includes('tentang dsc') ||
    q.includes('apa itu gdsc') ||
    q === 'dsc uhamka' ||
    q === 'dsc uhamka?'
  ) {
    return ANSWER_APA_ITU_DSC;
  }

  return null;
}

// In-Scope keyword checker for topics related to DSC, UHAMKA, or developer tech
const IN_SCOPE_KEYWORDS = [
  'dsc', 'gdsc', 'uhamka', 'ftii', 'pixel', 'vector', 'cypher', 'divisi',
  'lead', 'team', 'member', 'anggota', 'join', 'gabung', 'daftar',
  'workshop', 'event', 'acara', 'study jam', 'coding', 'program',
  'developer', 'google', 'kampus', 'lokasi', 'alamat', 'sertifikat',
  'figma', 'react', 'flutter', 'cloud', 'iot', 'security', 'tech',
  'teknologi', 'mahasiswa', 'kuliah', 'halo', 'hai', 'pagi', 'siang',
  'sore', 'malam', 'assalamualaikum', 'bantuan', 'tanya', 'kegiatan'
];

const SYSTEM_INSTRUCTION = `You are the official AI assistant for DSC UHAMKA (Developer Student Clubs Universitas Muhammadiyah Prof. DR. HAMKA), guided and powered by Google Developers.

Your Knowledge & Personality:
1. Always be polite, friendly, clear, and professional in Indonesian (or English if the user writes in English).
2. Scope: You ONLY assist with questions regarding DSC UHAMKA, our 3 divisions (The Pixels, The Vectors, The Cyphers), student tech learning, workshops, and the Google Developer ecosystem.
3. Out-of-Scope Rule: If the user asks about matters completely outside DSC UHAMKA and Google Developers (e.g. food recipes, celebrity gossip, homework in unrelated subjects, politics, general non-tech advice), you MUST politely decline with:
"${OUT_OF_SCOPE_DECLINE_MESSAGE}"
4. Safety & Policy: NEVER answer or entertain anything involving pornography, SARA (ethnicity, religion, race, inter-group disputes), politics, elections, weapons, hate speech, or negative topics. Firmly and politely refuse using the out-of-scope statement.
5. Membership / Join: Joining DSC UHAMKA is 100% FREE and requires NO registration form! Users join directly via Discord (${OFFICIAL_LINKS.discord.url}) and WhatsApp Community (${OFFICIAL_LINKS.whatsapp.url}).
6. Official Social Links & Backlinks: Whenever sharing info or social channels, use proper Markdown format so they become clickable backlinks:
   • Instagram: [${OFFICIAL_LINKS.instagram.handle}](${OFFICIAL_LINKS.instagram.url})
   • LinkedIn: [${OFFICIAL_LINKS.linkedin.name}](${OFFICIAL_LINKS.linkedin.url})
   • Discord: [${OFFICIAL_LINKS.discord.name}](${OFFICIAL_LINKS.discord.url})
   • WhatsApp Community: [${OFFICIAL_LINKS.whatsapp.name}](${OFFICIAL_LINKS.whatsapp.url})
   • Email: [${OFFICIAL_LINKS.email}](mailto:${OFFICIAL_LINKS.email})
7. Divisions:
   - The Pixels: UI/UX & Creative Design (Figma, Design systems, User Research, 3D & motion). PIC: Firdaus Firmansyah.
   - The Vectors: Web & Mobile Engineering (React, Flutter, JavaScript/TypeScript, Git). PIC: Salvalynda Riana Putri.
   - The Cyphers: Cloud, Security & IoT (Google Cloud Platform, Networks, Cybersecurity, IoT). PIC: Rafi Diandra.
8. Campus: FTII Kampus E UHAMKA, Jl. Tanah Merdeka No.6, Ciracas, Jakarta Timur.
9. Lead: Tiananmen Setyo Nugroho.
10. Community FAQ & Events Reference:
${JSON.stringify({ faq, events: events.map((e) => ({ title: e.title, description: e.description, date: e.start })) })}
`;

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return json({ error: 'Request origin is not allowed.' }, 403);
  }

  // Parse JSON message safely
  let message = '';
  try {
    const body = await request.json();
    if (body && typeof body.message === 'string') {
      message = body.message.trim();
    }
  } catch {
    return json({ error: 'Format pesan tidak valid.' }, 400);
  }

  if (!message) {
    return json({ error: 'Silakan ketik pertanyaan Anda.' }, 400);
  }

  // Rate limiting check
  try {
    const blocked = await rateLimit(request, 'chatbot', 30);
    if (blocked) return blocked;
  } catch {
    // Continue
  }

  // Check Policy / Safety Filter first
  for (const pattern of SENSITIVE_OR_NEGATIVE_PATTERNS) {
    if (pattern.test(message)) {
      return json(
        {
          reply: OUT_OF_SCOPE_DECLINE_MESSAGE,
          source: 'policy',
        },
        200
      );
    }
  }

  // 1. Check Intelligent Local Knowledge Base
  // Immediate, richly formatted response with verified backlinks & zero rate-limit risk
  const localMatch = matchLocalKnowledge(message);
  if (localMatch) {
    return json({ reply: localMatch, source: 'knowledge_base' }, 200);
  }

  // Quick check: If the message is completely out-of-scope (no tech/DSC/UHAMKA words)
  const normalized = message.toLowerCase();
  const hasInScopeWord = IN_SCOPE_KEYWORDS.some((kw) => normalized.includes(kw));

  // 2. Call Google Gemini 2.5 Flash for contextual / nuanced inquiries
  const key = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  if (!key) {
    return json(
      {
        reply: hasInScopeWord ? ANSWER_INFO_LEBIH_LANJUT : OUT_OF_SCOPE_DECLINE_MESSAGE,
        source: 'local_fallback',
      },
      200
    );
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }],
          },
          contents: [{ role: 'user', parts: [{ text: message }] }],
          generationConfig: {
            maxOutputTokens: 700,
            temperature: 0.3,
          },
        }),
        cache: 'no-store',
        signal: AbortSignal.timeout(20000),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const candidate = data.candidates?.[0];
      const reply = candidate?.content?.parts
        ?.filter(
          (p: { text?: string; thought?: boolean }) =>
            typeof p.text === 'string' && !p.thought
        )
        ?.map((p: { text: string }) => p.text)
        ?.join('')
        ?.trim();

      if (reply) {
        return json({ reply, source: 'gemini' }, 200);
      }
    }

    // If Gemini returns 429 (rate-limited) or non-OK response:
    // Determine whether query is in-scope or out-of-scope
    if (!hasInScopeWord) {
      return json(
        {
          reply: OUT_OF_SCOPE_DECLINE_MESSAGE,
          source: 'policy',
        },
        200
      );
    }

    return json(
      {
        reply: `Halo! Kami siap membantu Anda seputar kegiatan, divisi, dan komunitas DSC UHAMKA. 

Silakan tanyakan hal-hal spesifik seperti:
• *"Apa saja divisi di DSC UHAMKA?"*
• *"Apa itu divisi The Pixels / The Vectors / The Cyphers?"*
• *"Bagaimana cara join member DSC UHAMKA?"*
• *"Dimana lokasi kampus FTII UHAMKA?"*

Atau hubungi kami langsung melalui kanal resmi:
• **Instagram**: [${OFFICIAL_LINKS.instagram.handle}](${OFFICIAL_LINKS.instagram.url})
• **Discord**: [${OFFICIAL_LINKS.discord.name}](${OFFICIAL_LINKS.discord.url})
• **WhatsApp Community**: [${OFFICIAL_LINKS.whatsapp.name}](${OFFICIAL_LINKS.whatsapp.url})`,
        source: 'resilient_fallback',
      },
      200
    );
  } catch {
    return json(
      {
        reply: hasInScopeWord
          ? `Maaf, terjadi kendala koneksi ke asisten AI. Untuk informasi seputar DSC UHAMKA, Anda dapat mengunjungi kanal resmi kami:

• **Instagram**: [${OFFICIAL_LINKS.instagram.handle}](${OFFICIAL_LINKS.instagram.url})
• **Discord**: [${OFFICIAL_LINKS.discord.name}](${OFFICIAL_LINKS.discord.url})
• **WhatsApp Community**: [${OFFICIAL_LINKS.whatsapp.name}](${OFFICIAL_LINKS.whatsapp.url})
• **Email**: [${OFFICIAL_LINKS.email}](mailto:${OFFICIAL_LINKS.email})`
          : OUT_OF_SCOPE_DECLINE_MESSAGE,
        source: 'resilient_fallback',
      },
      200
    );
  }
}
