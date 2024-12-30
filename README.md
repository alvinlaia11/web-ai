# Chat AI Assistant

Aplikasi chat AI yang memungkinkan pengguna untuk berinteraksi dengan asisten AI dalam antarmuka yang modern dan responsif. Menggunakan Google Gemini sebagai model AI untuk memberikan respons yang cerdas dan natural.

## Fitur Utama

### Google Gemini AI
- Model bahasa AI terbaru dari Google
- Kemampuan memahami konteks yang lebih baik
- Respons yang natural dan informatif
- Dukungan multi-bahasa (Indonesia dan Inggris)
- Dapat memahami dan merespons berbagai jenis pertanyaan

### Manajemen Chat
- Buat chat baru dengan mudah
- Edit judul chat
- Hapus chat yang tidak diperlukan
- Pencarian chat berdasarkan judul
- Riwayat chat tersimpan secara lokal

### Pengaturan yang Dapat Disesuaikan
- **Tema**
  - Mode Terang
  - Mode Gelap
  - Mengikuti Sistem
- **Bahasa**
  - Indonesia
  - English
- **Ukuran Font**
  - Kecil
  - Sedang
  - Besar

### Fitur Terbaru

#### Keamanan dan Privasi
- Enkripsi end-to-end untuk data chat
- Penyimpanan lokal yang aman
- Tidak ada data yang dikirim ke server selain untuk komunikasi dengan AI
- Penghapusan data yang aman

#### Optimasi Performa
- Lazy loading untuk riwayat chat
- Kompresi data untuk penyimpanan efisien
- Caching untuk respons AI yang sering digunakan
- Optimasi rendering untuk daftar chat panjang

#### Aksesibilitas
- Dukungan screen reader
- Navigasi keyboard yang lengkap
- Kontras warna yang memenuhi standar WCAG
- Mode high contrast

### Antarmuka Responsif
- Tampilan optimal di desktop dan mobile
- Sidebar yang dapat disembunyikan
- Gestur sentuh untuk mobile
- Pull-to-refresh untuk memperbarui konten
- Dukungan untuk orientasi landscape dan portrait
- Adaptive layout untuk berbagai ukuran layar

### Desain Modern
- Antarmuka yang bersih dan intuitif
- Animasi yang halus
- Tema warna yang konsisten
- Ikon yang informatif

## Teknologi yang Digunakan

- **AI Model**: Google Gemini
- **Frontend**: React.js
- **Styling**: Tailwind CSS
- **State Management**: React Hooks & Context API
- **Routing**: React Router
- **Icons**: Heroicons
- **Testing**: Jest
- **Linting**: ESLint
- **Formatting**: Prettier

## Instalasi

1. Clone repository
```bash
git clone https://github.com/alvinlaia11/web-ai.git
```

2. Masuk ke direktori proyek
```bash
cd web-chat-ai
```

3. Install dependensi
```bash
npm install
```

4. Konfigurasi API Key
- Dapatkan API key dari [Google AI Studio](https://makersuite.google.com/app/apikey)
- Buat file `.env` di root proyek
- Tambahkan API key:
```env
VITE_GEMINI_API_KEY=your_api_key_here
```

5. Jalankan aplikasi
```bash
npm run dev
```

## Penggunaan

### Memulai Chat Baru
1. Klik tombol "Chat Baru" di sidebar
2. Mulai percakapan dengan AI Assistant
3. Chat akan otomatis tersimpan

### Mengelola Chat
- **Edit Judul**: 
  - Klik ikon pensil di sebelah judul chat
  - Masukkan judul baru
  - Tekan Enter untuk menyimpan atau Esc untuk membatalkan
- **Hapus Chat**: 
  - Klik ikon tempat sampah di sebelah chat
  - Konfirmasi penghapusan di dialog yang muncul
- **Cari Chat**: 
  - Gunakan kolom pencarian di bagian atas sidebar
  - Pencarian dilakukan pada judul dan isi pesan terakhir
  - Hasil pencarian ditampilkan secara real-time
- **Bersihkan Riwayat**:
  - Klik tombol "Bersihkan Semua" di bagian bawah sidebar
  - Konfirmasi untuk menghapus semua riwayat chat

### Mengubah Pengaturan
1. Klik ikon pengaturan di bagian bawah sidebar
2. Sesuaikan tema, bahasa, dan ukuran font
3. Klik "Selesai" untuk menyimpan perubahan

## Kontribusi

Kami sangat menghargai kontribusi dari komunitas. Untuk berkontribusi:

1. Fork repository
2. Buat branch baru (`git checkout -b fitur-baru`)
3. Commit perubahan (`git commit -m 'Menambah fitur baru'`)
4. Push ke branch (`git push origin fitur-baru`)
5. Buat Pull Request

## Catatan Rilis

### Versi 1.0.0
- Integrasi dengan Google Gemini AI
- Fitur chat dasar
- Manajemen chat
- Pengaturan tema dan bahasa
- Antarmuka responsif
- Penyimpanan lokal

## Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE)

## Pengembang

- Developer - [Alvin Laia]

## Kontak

Untuk pertanyaan dan dukungan, silakan hubungi kami di:
- Website: https://www.alvinportofolio.my.id/
- Linkedin: https://www.linkedin.com/in/alvinlaia/

---

Dibuat dengan  di Indonesia
