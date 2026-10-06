# Website Undangan Jalan-Jalan — Salsa

Project starter vanilla HTML/CSS/JS berdasarkan konsep yang sudah disepakati.

## Cara menjalankan
1. Buka folder project.
2. Foto sudah ada di `assets/images/` (`foto01.jpg` dst.). Untuk menambah: salin file ke folder itu.
3. Tambahkan barisnya di daftar `CONFIG.photos` dalam `js/script.js` (urutan daftar = urutan tampil; `.mp4` tampil sebagai video).
4. Ganti `CONFIG.whatsappNumber` dengan nomor WhatsApp tujuan, format internasional tanpa `+`, spasi, atau tanda baca.
5. Buka `index.html` di browser.

Untuk pengalaman terbaik, jalankan dengan Live Server/hosting statis.

## Catatan
- Pesan WhatsApp pembuka kepada Salsa TIDAK dibuat oleh website. Pesan itu dikirim manual.
- Website hanya menyiapkan jawaban akhir untuk WhatsApp.
- Foto tidak benar-benar dihapus; pilihan "Hapus" hanya simulasi/interaksi.
- Placeholder foto `foto1.jpg` dst. bisa diganti dengan foto asli.
- Nomor WhatsApp jangan ditaruh di banyak tempat; cukup edit satu variable di `js/script.js`.

## Yang sudah diperbaiki
- Tombol sekarang berfungsi (sebelumnya event klik tidak pernah dipasang, jadi macet di layar pertama).
- Urutan "Yakin gamau?" mulai dari kalimat pertama (1/9), dan ada tombol "Eh, mau deh" untuk berubah pikiran.
- Alasan "Nggak mau" tidak lagi tertukar dengan alasan hapus foto.
- Pilihan soal foto (dan alasannya) ikut terkirim di pesan WhatsApp.
- Tanggal tidak bisa dipilih mundur, dan dikirim dalam format Indonesia.
- Foto yang belum ada tampil sebagai placeholder, bukan gambar rusak.

## Lagu (2 lagu)
1. Salin file lagu ke `assets/audio/` dengan nama `lagu1.m4a` dan `lagu2.mp3` (kalau nama/format lain, ubah `src` di `CONFIG.music.tracks`).
2. Lagu 1 mulai saat layar foto terbuka, diputar mulai menit 1:46 (`from: "1:46"`) sampai habis.
3. Lagu 2 otomatis menyambung begitu lagu 1 habis (`startAt: "after"`), lalu mengulang sendiri sampai akhir.
4. Mau lagu mulai di layar lain? Ubah `startAt`-nya: `"opening"`, `"photos"`, `"letter"`, `"offer"`, `"form"`, `"agreement"`, `"final"`, atau `"after"` (sambung setelah lagu sebelumnya habis).
5. Tombol 🎵 di pojok kanan atas untuk mematikan / menyalakan. Kalau salah satu file tidak ada, lagu itu dilewati dan website tetap jalan.

## Pengaturan cepat (js/script.js)
- `MEMORY_INTRO`: kecepatan layar "Sebelum lanjut" yang jalan sendiri.
- `spawnFlower` / `petals`: jumlah bunga jatuh (angka `330` = jeda antar bunga dalam ms; makin kecil makin ramai).
- `timeOptions` dan `dayHint`: pilihan jam dan catatan jadwal per hari.

## Alur
Kotak surat → Opening → Foto → Pilihan foto → Surat → Mau/Tidak → Form jalan-jalan atau alasan → Surat perjanjian → Tanda tangan → Kirim jawaban ke WhatsApp.
