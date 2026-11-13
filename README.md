# 🌐 DSC UHAMKA — Modern Website Redesign
> **Developer Student Clubs Universitas Muhammadiyah Prof. DR. HAMKA**  
> An editorial, ultra-fast, responsive, and interactive community platform designed with the elegance of [Google Blog](https://blog.google/) and [Antigravity](https://antigravity.google/).

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-v12-f43f5e?style=flat-square&logo=framer)](https://www.framer.com/motion/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## 📖 Ringkasan Proyek (Overview)

Website ini merupakan hasil **redesign menyeluruh** dari situs resmi Developer Student Clubs (DSC) Universitas Muhammadiyah Prof. DR. HAMKA. Menggantikan tampilan lama yang kaku menjadi platform komunitas modern kelas dunia dengan memadukan:

1. **Google Blog Editorial Layout**: Tata letak artikel dan kartu yang lapang (*breathable whitespace*), tipografi berkekuatan visual tinggi (*Plus Jakarta Sans* & *Inter*), serta hierarki konten yang mudah dicerna.
2. **Antigravity Micro-Interactions**: Transisi antar-halaman yang halus, kartu interaktif dengan *spring physics*, *ambient radial glow* 4 warna khas Google (*Blue, Red, Yellow, Green*) dengan intensitas terkontrol (elegan dan tidak norak).
3. **GDG Community Standards**: Struktur direktori kegiatan terstandarisasi (*Upcoming*, *Past*, *Live*), integrasi Google Calendar instan, profil pembicara, dan direktori tim lengkap dengan portofolio.
4. **Performa Kilat (Static Site Generation / SSG)**: Dibangun dengan arsitektur statis Next.js 15 App Router sehingga waktu muat halaman (*First Contentful Paint*) berada di bawah 0.8 detik dengan skor Core Web Vitals optimal.

---

## ✨ Fitur Unggulan (Key Features)

### 1. 🏠 Homepage (`/`)
* **Hero Section Interaktif**: Headline dinamis dengan efek teks berganti (*rotating typewriter animation*), tombol aksi cepat, dan ambient glow lembut.
* **Impact Metrics Bento Grid**: Menampilkan data pencapaian riil komunitas (272 anggota aktif, 29 kegiatan & study jam, 3 divisi inti, 100% gratis).
* **Interactive Division Pillars**: Tab interaktif untuk menjelajahi 3 pilar: *The Pixels* (Design & UI/UX), *The Vectors* (Web & Mobile Development), dan *The Cyphers* (Cloud & Cybersecurity).
* **Community Story & Partner Showcase**: Bagian narasi visual mahasiswa dan carousel mitra resmi (Google Student Ambassadors, Kretya Studio, Shinji Sho, Data Science Indonesia, ACT).

### 2. 📅 Events & Study Jams Hub (`/events` & `/events/[slug]`)
* **Pencarian Cerdas**: Pencarian instan dengan toleransi kesalahan ketik 1 karakter (*fuzzy typo tolerance*).
* **Filter Multi-Kategori**: Tab periodisasi (*All, Upcoming, Past*) dan filter tombol pill berdasarkan divisi.
* **Halaman Detail Event Split-View**:
  * Kolom konten editorial: deskripsi, agenda interaktif timeline, checklist persiapan peserta, serta galeri foto dokumentasi.
  * *Sticky Registration Rail*: Menampilkan countdown mundur waktu nyata, status registrasi live, kartu pembicara, dan generator link **Add to Google Calendar** (WIB / Asia/Jakarta +07:00).

### 3. 👥 Core Team Directory (`/team`)
* **Lead Spotlight Card**: Kartu profil khusus ketua DSC dengan kutipan visi misi dan link sosial media.
* **Filter Divisi Tim**: Memudahkan pengunjung memfilter anggota berdasarkan peran (*Core Board, The Vectors, The Pixels, The Cyphers, Event & PR*).
* **Kartu Anggota Modern**: Foto profil bersih beresolusi tinggi dengan efek hover halus, badge divisi, serta tautan langsung ke LinkedIn, GitHub, Instagram, dan Google Developer Profile resmi.

### 4. ❓ Frequently Asked Questions (`/faq`)
* Accordion dinamis berbasis **Radix UI** dengan animasi expand/collapse menggunakan *spring physics*.
* Filter kategori cepat (*General, Events & Certificates, Recruitment, Collaboration*) dan search bar pertanyaan instan.

### 5. ⚡ Global Ergonomics & Aksesibilitas
* **Floating Frosted Glass Navbar**: Menempel di bagian atas dengan efek blur modern, tombol ganti tema (*Light / Dark mode*) yang tersimpan di `localStorage`.
* **Quick Command Palette (`Cmd+K` / `Ctrl+K`)**: Akses cepat ke seluruh rute halaman dan pencarian event melalui keyboard.
* **Standar Aksesibilitas WCAG AA**: Kontras warna memenuhi standar minimum 4.5:1, mendukung navigasi keyboard penuh, dan menghormati preferensi pengguna *prefers-reduced-motion*.

---

## 🛠️ Tech Stack & Arsitektur

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) | Rendering Static Site Generation (SSG) dengan Turbopack |
| **Language** | [TypeScript 5.8](https://www.typescriptlang.org/) | Strict Type-Safety & interface terpusat |
| **UI Library** | [React 19](https://react.dev/) | React Server Components & client hooks |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Engine utility-first terbaru dengan PostCSS teroptimasi |
| **Components** | [Radix UI](https://www.radix-ui.com/) | Primitif Dialog dan Accordion tanpa styling bawaan (aksesibel) |
| **Animations** | [Framer Motion v12](https://www.framer.com/motion/) | Transisi layout dinamis dan sliding tab indicators |
| **Icons** | [Lucide React](https://lucide.dev/) | Koleksi ikon konsisten, ringan, dan elegan |
| **Image Pipeline**| [Sharp](https://sharp.pixelplumbing.com/) | Optimasi WebP otomatis dan LQIP (Blur Placeholder) |
| **Fonts** | `@fontsource-variable` | *Plus Jakarta Sans* & *Inter* terdistribusi lokal (tanpa dependensi eksternal) |

---

## 📁 Struktur Direktori (Project Structure)

```text
├── docs/                      # Dokumentasi asal data dan lisensi aset
├── public/
│   ├── images/                # Aset gambar sumber (PNG/WebP/SVG)
│   └── optimized/             # Gambar hasil kompresi WebP oleh Sharp
├── scripts/
│   ├── prepare-images.mjs     # Pipeline Sharp: kompresi WebP & generator blur placeholder
│   └── validate-export.mjs    # Validasi integritas rute statis, link internal, dan aset
├── src/
│   ├── app/                   # Next.js App Router (Rute halaman)
│   │   ├── divisions/         # Halaman /divisions
│   │   ├── events/            # Halaman /events dan /events/[slug]
│   │   ├── faq/               # Halaman /faq
│   │   ├── team/              # Halaman /team
│   │   ├── globals.css        # Variabel desain, tema warna Google, dan layout rules
│   │   ├── layout.tsx         # Root layout dengan Shell & Navbar
│   │   └── page.tsx           # Halaman utama (Homepage)
│   ├── components/            # Komponen modular aplikasi
│   │   ├── layout/            # Shell navigasi, Floating Navbar, Footer, Command Menu
│   │   ├── ui/                # Primitives: Photo (dengan blur placeholder), Badge, Heading
│   │   ├── divisions.tsx      # Komponen tab divisi
│   │   ├── events.tsx         # Komponen daftar dan kartu event
│   │   ├── faq.tsx            # Komponen accordion FAQ
│   │   ├── home.tsx           # Komponen sections homepage
│   │   └── team.tsx           # Komponen spotlight & grid tim
│   ├── content/               # Data lokal terstruktur (Zero latency)
│   │   ├── assets.json        # Metadata dimensi & base64 blur placeholder
│   │   ├── events.json        # Data seluruh event & study jams
│   │   ├── faq.json           # Data pertanyaan & jawaban resmi
│   │   └── team.json          # Data seluruh anggota tim & link portofolio
│   ├── lib/                   # Utilitas helper (format tanggal WIB, sinkronisasi kalender)
│   └── types/                 # Definisi tipe data TypeScript (Event, Member, Asset)
├── tests/                     # Unit tests (WCAG contrast, timezone boundary, fuzzy search)
└── next.config.ts             # Konfigurasi Next.js (output: 'export' untuk static hosting)
```

---

## 🚀 Panduan Memulai (Getting Started)

### Prasyarat
Pastikan komputer Anda telah terinstal:
* [Node.js](https://nodejs.org/) versi 18.18 atau lebih tinggi
* [npm](https://www.npmjs.com/) versi 9 atau lebih tinggi

### 1. Kloning Repositori
```bash
git clone https://github.com/Firdaus-Firmansyah/dsc-uhamka-redesign.git
cd dsc-uhamka-redesign
```

### 2. Instalasi Dependensi
```bash
npm ci
```

### 3. Menjalankan Server Pengembangan (Dev Mode)
```bash
npm run dev
```
Buka browser Anda di [http://localhost:3000](http://localhost:3000) untuk melihat website secara langsung dengan fitur *Hot-Module Replacement*.

### 4. Menjalankan Pengujian (Testing) & Typecheck
```bash
# Memverifikasi type safety TypeScript
npm run typecheck

# Menjalankan unit tests
npm test
```

### 5. Melakukan Build Statis & Verifikasi
```bash
# Melakukan build produksi statis (output ke folder /out)
npm run build

# Memverifikasi integritas link dan aset hasil ekspor
npm run verify:export

# Menjalankan preview hasil build lokal
npm run preview
```

---

## ☁️ Panduan Hosting di Vercel (Deployment Guide)

Website ini telah dikonfigurasi sebagai **Static Export** (`output: 'export'`), sehingga dapat dihosting di **Vercel** secara **100% gratis** dengan performa CDN global terbaik.

### Cara 1: Menggunakan Vercel Dashboard (Rekomendasi Utama)

1. Pastikan repositori ini sudah ter-push ke akun GitHub Anda.
2. Masuk ke [Vercel Dashboard](https://vercel.com/).
3. Klik tombol **"Add New..."** lalu pilih **"Project"**.
4. Cari dan pilih repositori `dsc-uhamka-redesign`, lalu klik **"Import"**.
5. Di bagian pengaturan proyek (**Configure Project**):
   * **Framework Preset**: Pilih `Next.js`.
   * **Build Command**: `npm run build`
   * **Output Directory**: `out`
6. Klik **"Deploy"**.
7. Dalam waktu kurang dari 1 menit, website Anda telah aktif secara global dengan domain gratis `*.vercel.app` dan HTTPS otomatis!

### Cara 2: Menggunakan Vercel CLI

Buka terminal di root project dan jalankan:
```bash
# 1. Login ke akun Vercel Anda
vercel login

# 2. Deploy preview
vercel

# 3. Deploy langsung ke Production
vercel --prod
```

---

## 📝 Manajemen Konten (Content Management)

Anda dapat memperbarui data website kapan saja tanpa perlu mengubah baris kode UI:

* **Menambah atau Mengedit Event**: Sunting file `src/content/events.json`. Pastikan format tanggal menggunakan zona waktu `+07:00` (WIB).
* **Menambah atau Mengedit Anggota Tim**: Sunting file `src/content/team.json`.
* **Menambah Pertanyaan FAQ**: Sunting file `src/content/faq.json`.
* **Menambahkan Gambar Baru**: Letakkan gambar di `public/images/`, lalu jalankan `npm run images` untuk otomatis mengompresi dan membuat blur placeholder.

---

## 👥 Tim & Kontributor

* **Universitas Muhammadiyah Prof. DR. HAMKA (UHAMKA)**
* **Developer Student Clubs (DSC) UHAMKA**
* **Core Team & Divisi**: *The Pixels*, *The Vectors*, *The Cyphers*, *Core Board*, and *Event & PR*.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah lisensi **MIT**. Silakan gunakan dan sesuaikan untuk keperluan pengembangan komunitas.
