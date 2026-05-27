# 🎼 GangNiaga AI OS — Integrasi MCP & Alatan Khas
> **Kategori:** Model Context Protocol (MCP) & Autonomous Script Running

GangNiaga AI OS meluaskan sempadan keupayaan model AI menerusi standard **Model Context Protocol (MCP)** dan kebolehan melaksanakan skrip pemprosesan media tempatan secara terus.

---

## 🔌 1. Rangka Kerja Model Context Protocol (MCP)

Sistem menyokong penyambungan pelayan MCP berasaskan standard **stdio (IPC)**. Pengurus pelayan (Client Manager) dilaksanakan dalam `src/lib/mcp.ts` untuk mengawal proses anak secara autonomi.

```
  ┌──────────────────────────────────────────────────────────┐
  │                 React UI / Agent Code                    │
  └─────────────────────────────┬────────────────────────────┘
                                │ (Panggilan API /api/mcp/invoke)
                                ▼
  ┌──────────────────────────────────────────────────────────┐
  │                 Next.js API Handler                      │
  └─────────────────────────────┬────────────────────────────┘
                                │ (Mengakses McpClientManager instance)
                                ▼
  ┌──────────────────────────────────────────────────────────┐
  │                 McpClientManager (Node.js)               │
  └─────────────────────────────┬────────────────────────────┘
                                │ (Membuka Process Anak spawn())
                                ▼
  ┌──────────────────────────────────────────────────────────┐
  │               Pelayan MCP StdIO (Child Process)          │
  │            (e.g., node /path/to/sqlite-mcp.js)           │
  └──────────────────────────────────────────────────────────┘
```

### A. Senarai Pelayan Lalai (Default Config)
Konfigurasi pelayan MCP disimpan dalam fail pendaftaran JSON peranti:
- **`filesystem`:** Membenarkan pembacaan dan penulisan terhad kepada folder ruang kerja selamat sahaja.
- **`sqlite`:** Menyediakan keupayaan query SQL langsung bagi urusan analitik data kompleks.
- **`puppeteer`:** Menguruskan pelayaran web dan pengambilan gambar skrin secara real-time.

---

## 🛠️ 2. Cara Menyambung Pelayan MCP Baru

Untuk menyambung pelayan MCP baru melalui console terminal:

### Langkah 1: Pasang Pelayan MCP
Pasang pelayan MCP pilihan menggunakan npm atau pip:
```bash
npm install -g @modelcontextprotocol/server-sqlite
```

### Langkah 2: Tambah Konfigurasi ke Pangkalan Data / Config JSON
Daftarkan pelayan baru dengan menghantar permintaan POST ke `/api/mcp`:
```json
{
  "id": "sqlite-db",
  "name": "SQLite DB Access",
  "command": "node",
  "args": ["C:/Users/megat/AppData/Roaming/npm/node_modules/@modelcontextprotocol/server-sqlite/dist/index.js", "db/local.db"],
  "status": "connected"
}
```

---

## 🐍 3. Skrip Alatan Khas Python (Office Media Master)

Bagi tugasan yang memerlukan dokumen berkualiti tinggi (Excel, PowerPoint, Word), GangNiaga tidak menggunakan model AI untuk menaip teks sahaja. Sistem akan melancarkan skrip Python yang dibina khas secara dinamik menggunakan `spawn`:

### Contoh Skrip Python: Laporan Excel (`scripts/excel_gen.py`)
Skrip ini memproses set data JSON dan menjana laporan kewangan bertaraf profesional berserta graf.

```python
import json
import argparse
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment

def build_sheet(data_path, output_path):
    # Membaca data input JSON
    with open(data_path, 'r') as f:
        payload = json.load(f)
        
    wb = Workbook()
    ws = wb.active
    ws.title = "Analisis Prestasi"
    
    # Reka bentuk tajuk dengan gaya Cyber-Obsidian HSL
    ws['A1'] = payload['title']
    ws['A1'].font = Font(name='Arial', size=16, bold=True, color='10B981') # Emerald
    
    # Menyimpan fail Excel output
    wb.save(output_path)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--data', required=True)
    parser.add_argument('--output', required=True)
    args = parser.parse_args()
    build_sheet(args.data, args.output)
```

### Kawalan Keselamatan Pelaksanaan Skrip (YOLO-Mode Safety):
1. **Pembersihan Hujah (Argument Sanitization):** Semua parameter ditapis untuk mengelakkan serangan Command Injection. Hujah dihantar sebagai senarai parameter (array) ke perintah `spawn`, bukannya sebagai rentetan teks (string interpolation) yang dievaluasi shell secara langsung.
2. **Pengehadan Hak Akses (Sandbox Execution):** Skrip hanya dibenarkan membaca dan menulis di dalam laluan sub-direktori `scratch/` dan `download/` sahaja.
