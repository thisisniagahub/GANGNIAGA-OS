# 🎼 GangNiaga AI OS — Sistem Kemahiran Autonomi (Skills Hub)
> **Kategori:** Closed-Loop Learning & Autonomous Skills Registration

Salah satu kelebihan utama GangNiaga AI OS ialah keupayaannya untuk belajar dan mencipta **Kemahiran Baru (Skills)** secara autonomi tanpa memerlukan pembasatan semula kod aplikasi (zero recoding).

---

## 🧠 1. Kitaran Pembelajaran Tertutup (Closed-Loop Learning Loop)

Sistem kemahiran GangNiaga dibina berteraskan kitaran maklum balas tertutup:

```
  ┌──────────────────────────────────────────────────────────┐
  │                 1. Tugasan Gagal / Isu                   │
  └─────────────────────────────┬────────────────────────────┘
                                │
                                ▼
  ┌──────────────────────────────────────────────────────────┐
  │         2. Ejen Melakukan Introspection Debugging        │
  └─────────────────────────────┬────────────────────────────┘
                                │
                                ▼
  ┌──────────────────────────────────────────────────────────┐
  │            3. Pakej Penyelesaian Ditulis                 │
  └─────────────────────────────┬────────────────────────────┘
                                │
                                ▼
  ┌──────────────────────────────────────────────────────────┐
  │        4. Kemahiran Ditulis ke Fail SKILL.md             │
  └─────────────────────────────┬────────────────────────────┘
                                │
                                ▼
  ┌──────────────────────────────────────────────────────────┐
  │        5. Skills Loader Memuat Kemahiran Dinamik         │
  └──────────────────────────────────────────────────────────┘
```

1. **Introspection:** Apabila sesuatu tugasan gagal sebanyak dua kali, ejen akan menghentikan pelaksanaan linear dan memulakan mod introspeksi diri untuk mencari punca kegagalan.
2. **Penyelesaian:** Ejen membina fail skrip pembetulan atau mendokumentasikan langkah manual penyelesaian.
3. **Pendaftaran:** Fail diletakkan di dalam direktori `skills/` berserta fail metadata `SKILL.md`.
4. **Reload:** `Skills Loader` memuatkan takrifan baru secara dinamik ke dalam memori ejen untuk rujukan sesi akan datang.

---

## 📝 2. Pemformatan Metadata `SKILL.md`

Setiap kemahiran di dalam sistem mestilah mempunyai fail `SKILL.md` di dalam direktorinya dengan struktur frontmatter YAML yang sah:

```markdown
---
name: "excel-generator"
description: "Menjana hamparan kerja Excel (xlsx) profesional menggunakan perpustakaan openpyxl Python"
category: "financial"
tags: ["excel", "finance", "reports"]
version: "1.0.0"
---

# Panduan Excel Generator

Kemahiran ini digunakan apabila pengguna atau ejen lain memerlukan penjanaan laporan kewangan bertingkat (multi-tab) dalam format Excel.

## 🛠️ Cara Penggunaan

Laksanakan skrip Python dengan menghantar hujah (arguments) fail JSON input:

```bash
python scripts/excel_gen.py --data input.json --output report.xlsx
```

## 📋 Struktur Input JSON
```json
{
  "title": "Laporan DSCR Suku Pertama",
  "data": []
}
```
```

### Medan Frontmatter YAML Wajib:
- **`name`:** Nama unik kemahiran (gunakan format kebab-case).
- **`description`:** Penerangan terperinci mengenai fungsi kemahiran untuk membolehkan ejen memahaminya menggunakan semantic search.
- **`category`:** Kategori operasi (`financial`, `analysis`, `reporting`, `general`).
- **`version`:** Versi semasa kemahiran untuk kawalan kualiti.

---

## ⚙️ 3. Mekanisme Kemasukan Dinamik (Skills Loader)

Sistem memuatkan kemahiran fizikal menggunakan modul `src/lib/skills-loader.ts`. Pengesanan automatik dilakukan dengan mengimbas folder `skills/` di akar direktori projek:

```typescript
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter'; // parser frontmatter YAML

export async function getLocalSkills() {
  const skillsDir = path.join(process.cwd(), 'skills');
  if (!fs.existsSync(skillsDir)) return [];

  const folders = fs.readdirSync(skillsDir);
  const skills = [];

  for (const folder of folders) {
    const skillPath = path.join(skillsDir, folder, 'SKILL.md');
    if (fs.existsSync(skillPath)) {
      const fileContent = fs.readFileSync(skillPath, 'utf8');
      const { data, content } = matter(fileContent);
      skills.push({
        slug: folder,
        name: data.name,
        description: data.description,
        category: data.category || 'general',
        tags: data.tags || [],
        version: data.version || '1.0.0',
        content: content
      });
    }
  }
  return skills;
}
```

### Faedah Reka Bentuk Ini:
- **Zero Restart:** Fail baru yang ditambah di dalam folder `skills/` akan segera dikesan pada panggilan API seterusnya tanpa perlu memulakan semula aplikasi web.
- **Security Isolation:** Hanya fail di bawah laluan direktori `skills/` dibenarkan untuk dimuat bagi mencegah serangan Directory Traversal.
