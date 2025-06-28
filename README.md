# **Demo Visualisasi Algoritma Pencarian: Binary vs. Linear Search**

Proyek ini merupakan demo web interaktif yang dibuat untuk memvisualisasikan dan membandingkan dua algoritma pencarian fundamental: **Binary Search** dan **Linear Search**. Aplikasi ini dikembangkan sebagai bagian dari tugas mata kuliah Desain dan Analisis Algoritma.

Studi kasus yang diangkat adalah penerapan algoritma dalam sistem absensi mahasiswa berbasis Nomor Induk Mahasiswa (NIM).

## **🚀 Link Demo**

Anda dapat mengakses dan mencoba demo aplikasi secara langsung melalui link berikut:

[**https://kuntinajma.github.io/demo-interaktif-algoritma-perbandingan/**](https://kuntinajma.github.io/demo-interaktif-algoritma-perbandingan/)

## **📸 Tampilan Aplikasi**

Berikut adalah beberapa tangkapan layar dari aplikasi demo:

Halaman Menu Utama

([https://github.com/user-attachments/assets/351c2898-deb8-446c-8917-60569aaf00ba](https://github.com/user-attachments/assets/351c2898-deb8-446c-8917-60569aaf00ba))

Demo Binary Search

([https://github.com/user-attachments/assets/cdf88ef0-846b-4e96-aaff-0f74992560b0](https://github.com/user-attachments/assets/cdf88ef0-846b-4e96-aaff-0f74992560b0))

Demo Linear Search

([https://github.com/user-attachments/assets/befc0673-8723-4129-911d-33a4fdfe3112](https://github.com/user-attachments/assets/befc0673-8723-4129-911d-33a4fdfe3112)))

## **⚙️ Alur Kerja Algoritma**

Aplikasi ini mendemonstrasikan cara kerja dua algoritma pencarian dengan alur yang berbeda:

### **1\. Linear Search (Pencarian Lurus)**

Algoritma ini bekerja dengan cara yang paling sederhana:

1. Mulai dari elemen pertama (indeks ke-0) dalam daftar.  
2. Bandingkan nilai elemen tersebut dengan nilai yang dicari (target).  
3. Jika sama, pencarian selesai dan elemen ditemukan.  
4. Jika tidak sama, pindah ke elemen berikutnya dan ulangi langkah ke-2.  
5. Proses ini berlanjut hingga elemen ditemukan atau seluruh daftar telah diperiksa.

Kelebihan: Sederhana dan tidak memerlukan data yang terurut.  
Kekurangan: Tidak efisien untuk data dalam jumlah besar (kompleksitas waktu O(n)).

### **2\. Binary Search (Pencarian Biner)**

Algoritma ini jauh lebih efisien dengan pendekatan "bagi dan taklukkan" (*divide and conquer*):

1. **Syarat:** Pastikan seluruh daftar data sudah terurut (misalnya, dari kecil ke besar).  
2. Tentukan elemen tengah (mid) dari ruang pencarian saat ini.  
3. Bandingkan nilai elemen tengah dengan nilai yang dicari (target).  
4.   
   * Jika sama, pencarian selesai.  
   * Jika target **lebih besar** dari elemen tengah, abaikan seluruh bagian kiri dan ulangi pencarian hanya di bagian kanan.  
   * Jika target **lebih kecil** dari elemen tengah, abaikan seluruh bagian kanan dan ulangi pencarian hanya di bagian kiri.  
5. Proses ini berlanjut hingga elemen ditemukan atau ruang pencarian habis.

Kelebihan: Sangat cepat dan efisien untuk data dalam jumlah besar (kompleksitas waktu O(log n)).  
Kekurangan: Membutuhkan data dalam keadaan terurut.

## **✨ Fitur Utama**

* **Menu Pilihan:** Halaman utama untuk memilih antara demo Binary Search atau Linear Search.  
* **Input Data Dinamis:** Pengguna dapat memasukkan sendiri kumpulan data NIM yang ingin diuji.  
* **Visualisasi Langkah-demi-Langkah:** Setiap langkah dari proses pencarian ditampilkan secara visual dan dengan penjelasan detail.  
* **Pengukuran Waktu Eksekusi:** Menampilkan waktu eksekusi rata-rata (dalam mikrodetik) untuk setiap pencarian.  
* **Desain Responsif:** Tampilan aplikasi dapat menyesuaikan diri dengan baik di berbagai ukuran layar.

## **🛠️ Teknologi yang Digunakan**

* **HTML5:** Untuk struktur dasar halaman web.  
* **CSS3 & Tailwind CSS:** Untuk desain antarmuka dan styling.  
* **JavaScript (ES6):** Untuk semua logika interaktif dan implementasi algoritma.
