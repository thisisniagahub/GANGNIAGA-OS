# 🎼 GangNiaga AI OS — API & Model Pangkalan Data
> **Kategori:** Data Persistence, ORM Models, & API Endpoints

GangNiaga AI OS menggunakan struktur data dwi-mod: **SQLite (via Prisma)** untuk pembangunan tempatan dan **Supabase (PostgreSQL)** untuk persekitaran pengeluaran (production), dijamin menggunakan Row Level Security (RLS) serta indeks yang optimum.

---

## 🗄️ 1. Model Pangkalan Data (Prisma Schema)

Berikut adalah jadual teras yang digunakan oleh sistem ejen untuk mengekalkan ingatan dan merekod status tugasan:

### A. Jadual Sesi Ejen (`AgentSession`)
Merekod sesi perbualan dan konfigurasi berjalan setiap ejen.

```prisma
model AgentSession {
  id             String       @id @default(cuid())
  name           String
  type           String       @default("general")
  status         String       @default("idle")    // idle | running | completed | error
  tasksCompleted Int          @default(0)
  lastActivity   DateTime?
  config         String?      // JSON string konfigurasi ejen
  organizationId String
  tasks          AgentTask[]
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  @@index([organizationId]) // Indeks untuk kelajuan penapisan mengikut tenant
}
```

### B. Jadual Tugasan Ejen (`AgentTask`)
Menjejaki setiap tugasan individu yang didelegasikan kepada ejen, termasuk input, output, dan masa pelaksanaan.

```prisma
model AgentTask {
  id          String       @id @default(cuid())
  sessionId   String
  session     AgentSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  type        String       // e.g., "Market Analysis", "Financial Forecast"
  status      String       @default("pending")  // pending | running | completed | failed
  input       String?      @db.Text
  output      String?      @db.Text
  duration    Int?         // dalam saat
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  @@index([sessionId])
}
```

### C. Jadual Ingatan Ejen (`AgentMemory`)
Menyimpan konteks pengetahuan yang dipelajari dan memori jangka panjang ejen.

```prisma
model AgentMemory {
  id             String   @id @default(cuid())
  type           String   // user | workspace | financial | workflow | agent
  category       String   // e.g., "Market Intelligence", "Competitor Pricing"
  content        String   @db.Text
  organizationId String
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([organizationId])
  @@index([type])
}
```

---

## 🔒 2. Keselamatan Pangkalan Data (Supabase RLS)

Dalam persekitaran pengeluaran, keselamatan data penyewa (tenant data isolation) dikuatkuasakan pada peringkat pangkalan data menggunakan **Row Level Security (RLS)** PostgreSQL:

```sql
-- 1. Mengaktifkan RLS pada jadual Sesi
ALTER TABLE public.agent_sessions ENABLE ROW LEVEL SECURITY;

-- 2. Membina polisi untuk menyekat akses silang penyewa
CREATE POLICY "Akses mengikut organisasi penyewa"
ON public.agent_sessions
FOR ALL
TO authenticated
USING (
  organization_id = (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
);
```

---

## 📡 3. Rujukan Laluan Endpoint API (API Reference)

Aplikasi mendedahkan beberapa endpoint API utama untuk digunakan oleh frontend atau ejen luaran:

### A. Sesi Ejen (`/api/sessions`)
- **`GET /api/sessions`:** Mengambil semua sesi ejen aktif bagi organisasi semasa.
- **`POST /api/sessions`:** Mencipta sesi ejen baru dengan konfigurasi khusus:
  ```json
  {
    "name": "Market Research Agent",
    "type": "research",
    "config": {
      "autoVerify": true,
      "geography": "SEA"
    }
  }
  ```

### B. Saluran Komunikasi Gateway (`/api/gateway`)
- **`POST /api/gateway/chat`:** Menghantar mesej ke ejen dan menerima maklum balas.
- **`GET /api/gateway/status`:** Memantau keadaan sambungan websocket OpenClaw dan status ejen.

### C. Pengurusan Pelayan MCP (`/api/mcp`)
- **`GET /api/mcp`:** Menyenaraikan semua pelayan MCP stdio yang aktif.
- **`POST /api/mcp`:** Menyambung atau mematikan sambungan pelayan MCP dinamik secara real-time.
- **`POST /api/mcp/invoke`:** Memanggil fungsi *tool* dari pelayan MCP tertentu.
  ```json
  {
    "serverId": "filesystem-mcp",
    "toolName": "read_file",
    "arguments": {
      "path": "C:/projects/PROJECT-GANGNIAGA/package.json"
    }
  }
  ```
