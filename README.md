# SPPD Application (Sistem Perintah Perjalanan Dinas)

Aplikasi manajemen Surat Perintah Perjalanan Dinas berbasis web modern.

## 🛠 Teknologi

- **Backend**: Node.js, Express.js, Sequelize ORM
- **Frontend**: Next.js 15, React 19, Tailwind CSS v4
- **Database**: MySQL (Dijalankan menggunakan **Laragon**)
- **Authentication**: JWT (JSON Web Token) dengan HttpOnly Cookies

## 📋 Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:

1. **[Node.js](https://nodejs.org/)** (Versi LTS disarankan, min v18)
2. **[Laragon](https://laragon.org/)** (Untuk server MySQL yang mudah dikelola di Windows)

## ⚙️ Instalasi

### 1. Setup Backend & Database

1. **Clone/Download** repository ini.
2. Buka terminal di folder root project (`sppd-app`).
3. Install dependencies backend:
   ```bash
   npm install
   ```
4. **Konfigurasi Database (Laragon)**:
   - Buka aplikasi **Laragon**.
   - Klik **Start All** untuk menjalankan MySQL.
   - Buka Database Manager (klik tombol **Database** di Laragon).
   - Buat database baru dengan nama: `sppd_db`.
     *(Anda bisa mengubah nama ini, tapi pastikan sesuai dengan file .env)*

5. **Konfigurasi Environment Variable**:
   - Copy file `.env.example` menjadi `.env`.
   - Sesuaikan konfigurasi database di `.env` jika password root Laragon Anda tidak kosong (default Laragon biasanya user: `root`, pass: *kosong*).

   Isi file `.env`:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=          # Kosongkan jika default Laragon
   DB_NAME=sppd_db
   JWT_SECRET=rahasia_jwt_anda_yang_aman
   PORT=8080
   FRONTEND_URL=http://localhost:3000
   ```

### 2. Setup Frontend

1. Buka terminal baru, masuk ke folder `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies frontend:
   ```bash
   npm install
   ```

## 🚀 Menjalankan Aplikasi

Anda perlu menjalankan Backend dan Frontend di dua terminal yang berbeda.

### Terminal 1: Backend (Server)
Pastikan Laragon (MySQL) sudah berjalan.
```bash
# Di root folder sppd-app
npm run dev
```
- Server akan berjalan di `http://localhost:8080`.
- *Note: Saat pertama kali dijalankan, aplikasi akan otomatis membuat tabel database (Auto-migration).*

### Terminal 2: Frontend (Client)
```bash
# Di folder sppd-app/frontend
npm run dev
```
- Aplikasi web akan berjalan di `http://localhost:3000`.

