-- MySQL Database Schema v3 - Zeifur Rohman Shop & Admin
-- Import this schema into your Hostinger phpMyAdmin database.

CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title_id` VARCHAR(150) NOT NULL,
  `title_en` VARCHAR(150) NOT NULL,
  `desc_id` TEXT NOT NULL,
  `desc_en` TEXT NOT NULL,
  `features_id` TEXT NOT NULL, -- Pipe separated list
  `features_en` TEXT NOT NULL, -- Pipe separated list
  `price` DECIMAL(12, 2) NOT NULL,
  `price_string` VARCHAR(30) NOT NULL,
  `class_name` VARCHAR(50) NOT NULL DEFAULT 'preview-presets',
  `icon_name` VARCHAR(50) NOT NULL DEFAULT 'coffee',
  `category_name` VARCHAR(50) NOT NULL DEFAULT 'templates',
  `tags` VARCHAR(255) NOT NULL DEFAULT 'Vite,GSAP',
  `payment_link` TEXT NOT NULL,
  `image_url` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed default catalog products into the table
INSERT INTO `products` (`id`, `title_id`, `title_en`, `desc_id`, `desc_en`, `features_id`, `features_en`, `price`, `price_string`, `class_name`, `icon_name`, `category_name`, `tags`, `payment_link`, `image_url`) 
VALUES 
(
  1, 
  'Traktir Kopi Kreatif (Dukungan Karya)', 
  'Buy Me a Coffee (Creator Support)', 
  'Dukung kontinuitas karya digital, eksperimen website, dan konten edukatif Zeifur Rohman dengan mentraktir secangkir kopi hangat. Anda bebas menentukan nominal apresiasi terbaik Anda secara sukarela via DOKU / QRIS.', 
  'Support Zeifur Rohmans ongoing digital creations, open web experiments, and educational guides by buying him a warm cup of coffee! Choose any contribution amount via live DOKU / QRIS Gateway.', 
  'Apresiasi Sukarela Bebas Nominal | Mendukung Karya Digital & Web Development | DOKU / QRIS / VA / E-Wallet Gateway | Ucapan Terima Kasih Spesial', 
  'Flexible Voluntary Contribution | Supports Digital Work & Web Development | Live DOKU / QRIS / E-Wallet Gateway | Heartfelt Creator Appreciation', 
  0.00, 
  'Rp ∞', 
  'preview-presets', 
  'coffee', 
  'coffee', 
  'Coffee,Support,Donation', 
  'https://pay.doku.com/p-link/p/TraktirKopi',
  NULL
(
  2,
  'CapKarya by Zeifur Rohman (Web App Monogram)',
  'CapKarya by Zeifur Rohman (Monogram Web App)',
  'Aplikasi web generator logo monogram & identitas visual instan berbasis browser yang dirancang khusus oleh Zeifur Rohman untuk membantu UMKM, pebisnis, dan kreator menciptakan cap identitas/monogram kelas premium secara presisi.',
  'Instant browser-based monogram logo & visual identity web application designed by Zeifur Rohman to empower small businesses, entrepreneurs, and creators to generate premium monogram logos in seconds.',
  'Editor Monogram Presisi 320x320px | Kustomisasi Inisial 2-3 Huruf & Tagline | Kontrol Rotasi Sudut & Skala Ukuran | Simpan Desain Favorit & Ekspor Aset | 100% Gratis Digunakan',
  '320x320px Precision Monogram Canvas | 2-3 Letter Monogram & Tagline Builder | Rotation Angle & Scale Controls | Local Favorites Saver & Asset Export | 100% Free to Use',
  0.00,
  'GRATIS (FREE DEMO)',
  'preview-template-1',
  'globe',
  'free-web',
  'CapKarya,WebApp,Monogram,Generator',
  'http://capkarya.great-site.net',
  'assets/images/capkarya-display-1.png'
),
(
  7,
  'Ebook: Personal Branding Anak Muda di Era Digital',
  'Ebook: Youth Personal Branding in the Digital Era',
  'Buku panduan praktis format PDF HD karya Zeifur Rohman yang mengupas tuntas rahasia dan strategi membangun personal branding yang kuat, otentik, dan berdaya saing tinggi bagi anak muda, mahasiswa, serta profesional di era digital.',
  'A comprehensive HD PDF guidebook written by Zeifur Rohman detailing end-to-end strategies to build a strong, authentic, and competitive personal brand for young people and professionals in the digital era.',
  'Chapter 1: Kenali Dirimu Sebelum Branding ke Dunia | Chapter 2: Optimasi Profil LinkedIn yang Bikin Recruiter Kepincut | Chapter 3: Konten LinkedIn & IG yang Bikin Kamu Dikenal Ahli | Chapter 4: Bangun Jaringan & Dapat Peluang dari Personal Brand | Chapter 5: Jaga Konsistensi & Terus Tumbuh Sebagai Brand | Format PDF HD 43+ Halaman | Akses Download Langsung & Update Selamanya',
  'Chapter 1: Know Yourself Before Branding to the World | Chapter 2: LinkedIn Profile Optimization for Recruiters | Chapter 3: LinkedIn & IG Content Strategy to Stand Out | Chapter 4: Build Network & Unlock Career Opportunities | Chapter 5: Consistency & Long-Term Growth | 43+ Pages HD PDF Format | Lifetime Download Access',
  49000.00,
  'Rp 49.000',
  'preview-presets',
  'book-open',
  'ebooks',
  'Ebook,PDF,Branding,Personal Brand',
  'https://dashboard.doku.com/retail/merchant/ZeifurRohmanFreelanc6206/EbookPersonalBrandingAnakMudadiEraDigital-849405b25d1d4b8f',
  'assets/images/ebook/ebook-cover-1.png'
)
ON DUPLICATE KEY UPDATE `id` = `id`;
