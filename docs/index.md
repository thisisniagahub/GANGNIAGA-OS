# 🎼 GangNiaga AI OS — Developer Documentation Portal
> **Gaya Rujukan:** Terperinci, Developer-First (Modelled after Nous Research Hermes Agent Docs)
> **Versi Portal:** v1.0.0

Selamat datang ke Portal Dokumentasi **GangNiaga AI OS**. Sistem ini dibina sebagai platform multi-ejen autonomi tertutup (closed-loop) berprestasi tinggi yang menggabungkan keupayaan kecerdasan perniagaan, automasi kerja, dan integrasi perkakas lanjutan (MCP/OpenClaw).

---

## 🧭 Navigasi Dokumentasi

Untuk rujukan mendalam, kami membahagikan dokumentasi ini kepada beberapa bahagian utama:

1. **[Senibina & Reka Bentuk Sistem](file:///C:/projects/PROJECT-GANGNIAGA/docs/architecture.md)** — Menjelaskan aliran kitaran ejen, sesi Zustand global, dan sistem komunikasi Gateway.
2. **[Sistem Kemahiran Autonomi (Skills Hub)](file:///C:/projects/PROJECT-GANGNIAGA/docs/skills.md)** — Penerangan terperinci mengenai *Closed-Loop Learning Loop*, pemformatan `SKILL.md`, dan pendaftaran kemahiran dinamik.
3. **[API & Model Pangkalan Data](file:///C:/projects/PROJECT-GANGNIAGA/docs/api-and-db.md)** — Struktur jadual SQLite (Prisma) dan Supabase, berserta rujukan laluan endpoint API utama.
4. **[Integrasi MCP & Alatan Khas](file:///C:/projects/PROJECT-GANGNIAGA/docs/custom-tools.md)** — Bagaimana untuk menyambung pelayan MCP stdio, skrip automasi pejabat Python, dan Playwright Deep Scrapers.

---

## 🚀 Panduan Permulaan Pantas (Quickstart)

### 1. Prasyarat Sistem
Pastikan peranti anda mempunyai perisian berikut sebelum memulakan pembangunan:
- **Bun** (v1.x.x disyorkan untuk kelajuan optimum)
- **Node.js** (v20+ jika tidak menggunakan Bun)
- **Git**

### 2. Pemasangan Dependensi & Setup Pangkalan Data
Jalankan arahan berikut di terminal anda:

```bash
# 1. Pasang semua pakej dependensi
bun install

# 2. Setup dan jana Prisma Schema untuk SQLite tempatan
bun x prisma generate
bun x prisma db push

# 3. Laksanakan data benih (seed data) ke pangkalan data
bun run prisma/seed.ts
```

### 3. Konfigurasi Pembolehubah Persekitaran (.env)
Bina fail `.env` di direktori akar projek dan masukkan konfigurasi utama:

```env
# URL & Kunci OpenRouter untuk Hermes Agent
NEXT_PUBLIC_HERMES_AGENT_URL="http://127.0.0.1:8000"
HERMES_API_KEY="hf_..."

# Kunci API OpenRouter (Menyokong putaran kunci tanpa had)
OPENROUTER_API_KEY_1="sk-or-..."
OPENROUTER_API_KEY_2="sk-or-..."

# Pangkalan Data Supabase (Untuk pengeluaran/production)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOi..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..."
```

### 4. Menjalankan Server Pembangunan
Jalankan perintah pembangunan Next.js:

```bash
bun run dev
```
Aplikasi kini boleh diakses melalui penyemak imbas di `http://localhost:3000`.

---

## 🎨 Falsafah Reka Bentuk (Design Core)
GangNiaga AI OS mengekalkan estetika **Cyber-Obsidian Glassmorphism** gred tinggi:
- **HSL-Tailored Dark Mode:** Warna latar belakang `bg-[#06080e]` disulam dengan backdrop kaca lutsinar (`backdrop-blur-xl`).
- **Tactile Transitions:** Sebarang pergerakan elemen interaktif menggunakan transisi spring tersuai `cubic-bezier(0.25, 1.1, 0.4, 1)` untuk memberi tindak balas fizikal (bouncy feedback) kepada pengguna.
- **Dynamic Indicators:** Penggunaan sliding hover highlights (`layoutId`) di sidebar memastikan navigasi meluncur dengan licin tanpa sebarang visual-jank.
