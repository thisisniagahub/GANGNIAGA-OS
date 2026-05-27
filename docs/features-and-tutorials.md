# 🎼 GangNiaga AI OS — Panduan Penggunaan & Tutorial Ciri-Ciri (Features Guide)
> **Skop:** Panduan Lengkap Pengguna, Penerangan Fungsian, & Aliran Kerja Langkah-Demi-Langkah (Step-by-Step)

Dokumen ini menyediakan panduan operasi terperinci untuk semua ciri-ciri utama yang terdapat dalam **GangNiaga AI OS**. Diilhamkan oleh standard dokumentasi Hermes Agent, panduan ini membimbing anda memahami cara fungsi sistem beroperasi dan langkah untuk menggunakannya secara praktikal.

---

## 📊 1. Modul Dashboard (Papan Pemuka)

### A. Bagaimana Ia Berfungsi
Dashboard bertindak sebagai pusat kawalan utama yang mengagregatkan data prestasi perniagaan dari pangkalan data SQLite/Supabase dan memaparkan status ejen yang sedang berjalan secara real-time. Ia membolehkan pengguna memantau petunjuk prestasi utama (KPI) perniagaan tanpa perlu meneliti laporan kewangan yang panjang.

### B. Tutorial Langkah-Demi-Langkah
1. Klik **Dashboard** di menu utama sidebar.
2. Di bahagian atas, anda akan melihat kad ringkasan **KPI Utama** seperti:
   * *Monthly Revenue* (Hasil Bulanan)
   * *Debt Service Coverage Ratio (DSCR)* — Sasaran minimum bank ialah 1.25x.
   * *Cash Runway* (Bulan Aliran Tunai Bertahan)
3. Di panel kanan, perhatikan **Status Fleet Ejen**. Ejen dengan status `running` akan berkelip hijau neon, menandakan mereka aktif memproses data latar belakang.
4. Tatal ke bawah untuk membaca **Log Aktiviti Terkini** yang memaparkan transaksi komunikasi OpenClaw Gateway secara langsung.

---

## 📄 2. Business Plans & Proposals (Cadangan Perniagaan)

### A. Bagaimana Ia Berfungsi
Ejen *Business Analyst* bekerjasama dengan *Report Generator* untuk membina draf kertas cadangan pinjaman atau geran komprehensif mengikut standard perbankan tempatan (21 seksyen profesional).

### B. Tutorial Langkah-Demi-Langkah
1. Klik butang **New Proposal** di sudut bawah sidebar atau klik submenu **Business Plans -> Proposals**.
2. Klik butang **Create New Proposal** di sudut kanan atas.
3. Lengkapkan borang maklumat asas perniagaan:
   * Nama Syarikat, Sektor Industri, Jenis Pinjaman yang dipohon (e.g., Bank Loan, Government Grant).
4. Klik **Generate Draft with AI**. Ejen Business Analyst akan memulakan operasi dan menulis draf untuk kesemua 21 seksyen (termasuk *Executive Summary*, *Market Analysis*, *Risk Assessment*).
5. Sebaik draf selesai, anda boleh menekan mana-mana seksyen untuk membaca, menyunting teks secara manual, atau mengarahkan Copilot menulis semula perenggan terpilih.
6. Klik **Export to PDF** untuk memuat turun salinan dokumen akhir yang sedia untuk dihantar kepada pihak bank.

---

## 💰 3. Financials & DSCR Calculator (Kewangan Perniagaan)

### A. Bagaimana Ia Berfungsi
Ejen *Financial Advisor* memproses data ramalan hasil dan perbelanjaan perniagaan. Ia melancarkan skrip Python di latar belakang untuk melakukan pengiraan formula kewangan, stress testing, dan nisbah DSCR.

### B. Tutorial Langkah-Demi-Langkah
1. Pilih **Financials** di sidebar.
2. Navigasi ke sub-tab **Revenue Forecast**:
   * Masukkan unjuran pertumbuhan bulanan (%) dan harga jualan. Ejen akan menjana graf ramalan hasil 12 bulan secara automatik.
3. Beralih ke sub-tab **Bank Metrics (DSCR)**:
   * Sistem akan mengira nisbah DSCR semasa perniagaan anda. 
   * Nisbah kelayakan selamat bank ialah **> 1.25x** (contoh: 1.45x bermaksud perniagaan mempunyai lebihan aliran tunai 45% untuk membayar ansuran bulanan).
4. Lakukan **Stress Testing**:
   * Tukar bar gelongsor (slider) ke tahap *30% Revenue Drop* (Kemerosotan Jualan 30%).
   * Perhatikan sama ada nilai DSCR masih berada di atas paras 1.25x. Jika jatuh ke paras merah (e.g., 1.10x), ejen Financial Advisor akan memberikan cadangan penambahbaikan aliran tunai di panel sebelah kanan.
5. Klik **Download Excel Report** untuk memuat turun hamparan kerja penuh (xlsx) profesional.

---

## 🧪 4. Idea Canvas (Validasi Idea Perniagaan)

### A. Bagaimana Ia Berfungsi
Menggunakan ejen *Market Researcher* untuk melakukan pencarian pantas fakta pasaran bagi menilai potensi daya maju idea perniagaan baharu berbanding benchmark pasaran semasa.

### B. Tutorial Langkah-Demi-Langkah
1. Klik **Idea Canvas** di bawah menu *Business Plans*.
2. Masukkan penerangan ringkas idea perniagaan anda (contoh: "SaaS platform for SME accounting in Malaysia using local languages").
3. Klik **Validate Idea**.
4. Ejen Market Researcher akan mengimbas internet untuk mencari statistik berkaitan pasaran sasaran.
5. Sistem akan menjana kanvas visual sembilan blok (SME Lean Canvas) berserta **Skor Daya Maju (Viability Score)** daripada 100:
   * *Markah > 75:* Idea berdaya maju tinggi.
   * *Markah < 50:* Idea mempunyai risiko kegagalan tinggi (e.g., pasaran terlalu tepu).

---

## ⚖️ 5. Plan Review (Penilaian Gred Bank)

### A. Bagaimana Ia Berfungsi
Ejen *Plan Review Agent* menyamar sebagai pegawai bank (Lender Persona) yang sangat ketat untuk menyemak kertas cadangan perniagaan anda dan mencari kelemahan sebelum anda menghantarnya kepada bank sebenar.

### B. Tutorial Langkah-Demi-Langkah
1. Pergi ke modul **Plan Review**.
2. Pilih kertas cadangan perniagaan yang telah dijana sebelum ini.
3. Tetapkan **Lender Persona**:
   * *Strict Bank Officer* (Sangat Ketat — memfokuskan nisbah kewangan & kolateral).
   * *Angel Investor* (Memfokuskan potensi pasaran & kualiti pasukan).
   * *Government Grant Officer* (Memfokuskan impak sosio-ekonomi & pematuhan kriteria).
4. Klik **Start Evaluation**.
5. Ejen akan memberikan penilaian bertulis berformat kad merah/kuning/hijau:
   * *Kad Merah (Critical Fixes):* Masalah besar (e.g., unjuran kos pemasaran tidak masuk akal).
   * *Kad Hijau (Strengths):* Kekuatan utama proposal anda.

---

## 🔍 6. Research Agent & Citation Verifier (Kajian Pesaing & Fakta)

### A. Bagaimana Ia Berfungsi
Ejen *Market Researcher* mengumpulkan data harga pesaing manakala ejen *Citation Verifier* membandingkan fakta tersebut dengan data rasmi daripada Statista, World Bank, dan Bank Negara Malaysia untuk memastikan kesahihan fakta.

### B. Tutorial Langkah-Demi-Langkah
1. Klik **Research Agent** di sidebar.
2. Taip soalan penyelidikan pasaran anda (contoh: "Berapakah purata yuran langganan bulanan perisian perakaunan awan di Malaysia?").
3. Ejen akan memaparkan hasil carian web, jadual harga pesaing utama, dan penunjuk peratusan kebolehpercayaan fakta (*Reliability Score*).
4. Setiap fakta yang disahkan akan dilampirkan dengan pautan terus ke sumber asal (Statista/World Bank) sebagai rujukan sah.

---

## 📡 7. Channel Connect (Integrasi WhatsApp / Slack)

### A. Bagaimana Ia Berfungsi
Menyambung ejen perniagaan anda ke peranti WhatsApp atau Slack melalui OpenClaw Gateway untuk membolehkan ejen menerima arahan atau menghantar laporan mingguan secara automatik.

### B. Tutorial Langkah-Demi-Langkah
1. Navigasi ke kategori **Integrations -> Channel Connect**.
2. Pilih saluran pilihan, contohnya **WhatsApp**.
3. Klik **Connect Channel** dan masukkan maklumat kelayakan token API WhatsApp Business anda.
4. Di tab **Soul Configuration**, sunting *System Prompt* untuk menetapkan personaliti ejen (contoh: "Anda adalah penasihat kewangan SME Malaysia yang tegas dan memfokuskan pemeliharaan margin untung").
5. Di tab **Automation**, klik **Add Scheduled Task**:
   * Tetapkan tugasan: "Hantar laporan DSCR dan unjuran tunai mingguan ke nombor WhatsApp Admin setiap hari Jumaat jam 5 petang".
   * Klik **Save Task**.

---

## 🔌 8. MCP Servers (Taman Permainan CLI & Integrasi Fail)

### A. Bagaimana Ia Berfungsi
Membolehkan pembangun menghubungkan ejen pintar secara terus dengan sistem fail peranti local, shell arahan CLI, atau pangkalan data SQL menggunakan protokol stdio.

### B. Tutorial Langkah-Demi-Langkah
1. Buka sub-menu **Channel Connect -> MCP Servers**.
2. Anda akan melihat senarai pelayan aktif seperti `filesystem-mcp`.
3. Gunakan **Live Executor Playground** di bahagian kanan halaman untuk mencuba arahan:
   * Pilih pelayan `filesystem-mcp`.
   * Pilih fungsi `read_file`.
   * Masukkan argument laluan fail: `{"path": "package.json"}`.
   * Klik **Execute Tool**. Output JSON fail `package.json` akan segera dipaparkan di konsol debug sebelah bawah.
