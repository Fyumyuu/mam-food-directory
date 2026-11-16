# MAM — Makan Area Mahasiswa

MAM adalah demonstrasi website direktori tempat makan di sekitar kampus. Proyek ini dibuat untuk **Tugas 2 — Implementasi Komponen Dasar dengan HTML, CSS, dan JavaScript**.

Fokus MAM adalah membantu mahasiswa melihat contoh informasi tempat makan, mencari berdasarkan nama tempat atau menu, memfilter berdasarkan kisaran harga, membaca informasi detail, dan melihat ilustrasi lokasi. MAM **bukan** aplikasi pemesanan makanan atau layanan pesan antar.

## Fitur yang tersedia

- Header dan navigasi utama dengan tautan ke halaman Jelajah dan Pencarian.
- Beranda dengan kolom pencarian dan daftar contoh tempat makan.
- Pencarian berdasarkan nama tempat atau kata kunci menu.
- Filter harga minimum dan maksimum, termasuk pilihan rentang cepat.
- Validasi ketika harga minimum lebih besar daripada harga maksimum.
- Halaman hasil pencarian dengan jumlah hasil dan opsi menghapus filter.
- Halaman detail berisi contoh menu, harga, jam operasional, dan perkiraan jarak.
- Halaman peta skematis sebagai ilustrasi, bukan peta atau navigasi sungguhan.
- Navigasi antarhalaman menggunakan URL hash, misalnya `#cari`, `#hasil`, `#tempat/warung-nasi-sela`, dan `#peta/warung-nasi-sela`.
- Tampilan responsif dengan pendekatan mobile-first.

## Teknologi

- HTML5 semantik
- CSS3, termasuk CSS custom properties untuk warna dan spacing
- JavaScript murni (vanilla JavaScript)
- Google Fonts: Fraunces dan IBM Plex Sans, dengan font fallback jika koneksi internet tidak tersedia

Tidak diperlukan framework, package manager, atau proses build.

## Struktur proyek

```text
mam-food-directory/
├── index.html   # Struktur halaman dan elemen semantik
├── styles.css   # Seluruh aturan tampilan, warna, grid, dan responsivitas
├── script.js    # Data contoh, pencarian, filter, dan navigasi
└── README.md    # Deskripsi proyek dan petunjuk penggunaan
```

## Cara menjalankan

**Cara paling sederhana:** buka `index.html` menggunakan browser modern.

**Menggunakan server lokal (opsional):** buka terminal di folder proyek, lalu jalankan:

```bash
python3 -m http.server 8000
```

Buka alamat berikut di browser:

```text
http://localhost:8000
```

## Cara mencoba fitur

1. Pada Beranda, masukkan nama tempat atau menu pada kolom pencarian, lalu tekan Enter.
2. Klik ikon filter untuk membuka Pencarian & Filter.
3. Masukkan harga minimum dan/atau maksimum, atau pilih salah satu rentang cepat.
4. Klik **Terapkan Filter** untuk melihat Hasil Pencarian.
5. Pilih salah satu tempat untuk membuka Detail Tempat Makan.
6. Klik **Lihat lokasi & arah** untuk membuka halaman peta ilustratif.
7. Gunakan tombol **Kembali** untuk kembali ke halaman sebelumnya dalam alur MAM.

## Catatan data dan batasan demonstrasi

Seluruh nama tempat makan, harga, menu, jam operasional, jarak, alamat, dan ilustrasi peta pada proyek ini adalah **data contoh/ilustrasi** yang ditulis di `script.js`. Data tersebut bukan informasi usaha nyata, bukan data hasil survei 17 responden, dan bukan kutipan wawancara mahasiswa. Halaman peta tidak menunjukkan lokasi maupun rute aktual. Tombol petunjuk arah hanya menampilkan keterangan bahwa fungsi navigasi nyata belum tersedia.

Proyek ini belum menggunakan backend atau basis data. Data contoh disimpan sebagai array JavaScript dan pencarian/filter berjalan di browser. Tidak ada data pribadi pengguna yang dikumpulkan atau dikirim ke server.

## Aksesibilitas dan responsivitas

- Menggunakan elemen semantik seperti `header`, `nav`, `main`, `section`, `form`, dan `footer`.
- Menyediakan tautan lewati navigasi (*skip link*) dan indikator fokus keyboard.
- Label, status, serta beberapa keterangan antarmuka disediakan untuk membantu teknologi bantu.
- Layout menyesuaikan lebar layar dan menghormati preferensi `prefers-reduced-motion`.

Ini merupakan upaya dasar aksesibilitas, bukan klaim bahwa aplikasi telah lulus audit WCAG.

## Deploy ke GitHub Pages (opsional)

1. Unggah `index.html`, `styles.css`, `script.js`, dan `README.md` langsung ke root repository.
2. Buka **Settings → Pages** pada repository GitHub.
3. Pada bagian Build and deployment, pilih **Deploy from a branch**.
4. Pilih branch `main` dan folder `/(root)`, lalu simpan.
5. Setelah proses deploy selesai, buka URL GitHub Pages yang diberikan GitHub.

Pastikan `index.html` berada langsung di root repository, bukan di dalam subfolder.
