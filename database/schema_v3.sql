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
),
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
)
ON DUPLICATE KEY UPDATE `id` = `id`;

-- ========================================================
-- BLOGS TABLE DEFINITION & SEEDS
-- ========================================================

CREATE TABLE IF NOT EXISTS `blogs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `title_id` VARCHAR(255) NOT NULL,
  `title_en` VARCHAR(255) NOT NULL,
  `category` VARCHAR(50) NOT NULL DEFAULT 'website',
  `tags` VARCHAR(255) NOT NULL DEFAULT 'website,branding',
  `author` VARCHAR(100) NOT NULL DEFAULT 'ZEIFUR ROHMAN',
  `created_date` VARCHAR(50) NOT NULL,
  `excerpt_id` TEXT NOT NULL,
  `excerpt_en` TEXT NOT NULL,
  `content_id` LONGTEXT NOT NULL,
  `content_en` LONGTEXT NOT NULL,
  `image_url` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `blogs` (`id`, `slug`, `title_id`, `title_en`, `category`, `tags`, `author`, `created_date`, `excerpt_id`, `excerpt_en`, `content_id`, `content_en`, `image_url`)
VALUES
(
  1,
  'strategi-pengembangan-website-modern',
  'STRATEGI PENGEMBANGAN WEBSITE MODERN YANG CEPAT DAN RESPONSIF',
  'MODERN WEB DEVELOPMENT STRATEGY FOR HIGH SPEED AND RESPONSIVENESS',
  'website',
  'branding,website',
  'ZEIFUR ROHMAN',
  'JUNE 08, 2026',
  'Dalam era digital saat ini, performa dan aksesibilitas website adalah kunci keberhasilan bisnis. Pelajari bagaimana memadukan vanilla JavaScript, animasi GSAP, dan optimalisasi Core Web Vitals.',
  'In todays digital era, website performance and accessibility are key to business success. Learn how to blend vanilla JavaScript, GSAP animations, and Core Web Vitals optimization.',
  '<h3>Metodologi Clean Code & Performa Utama</h3><p>Membangun website modern tidak lagi sekadar tentang visual yang indah, melainkan tentang kecepatan muat halaman dan struktur kode yang efisien...</p>',
  '<h3>Clean Code Methodology & Peak Performance</h3><p>Building modern websites is no longer just about aesthetics, but page load speed and efficient code architecture...</p>',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
),
(
  2,
  'filosofi-branding-visual-identitas-logo',
  'FILOSOFI BRANDING VISUAL: MENERJEMAHKAN VISI MENJADI IDENTITAS LOGO',
  'VISUAL BRANDING PHILOSOPHY: TRANSLATING VISION INTO LOGO IDENTITY',
  'branding',
  'branding',
  'ZEIFUR ROHMAN',
  'JUNE 05, 2026',
  'Logo bukan sekadar gambar, melainkan sebuah representasi filosofis dari visi dan misi suatu brand. Penting untuk melakukan riset audiens dan merumuskan panduan brand digital yang komprehensif.',
  'A logo is not just an image, but a philosophical representation of a brands vision and mission. It is vital to perform audience research and formulate comprehensive brand guidelines.',
  '<h3>Eksplorasi Monogram & Identitas Visual</h3><p>Setiap garis dan warna dalam desain logo memiliki bobot emosional dan daya pikat bisnis...</p>',
  '<h3>Monogram Exploration & Visual Identity</h3><p>Every line and color in logo design holds emotional weight and business appeal...</p>',
  'https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
),
(
  3,
  'seni-fotografi-dokumenter-dan-penceritaan-visual',
  'SENI FOTOGRAFI DOKUMENTER DAN PENCERITAAN VISUAL',
  'THE ART OF DOCUMENTARY PHOTOGRAPHY AND VISUAL STORYTELLING',
  'photography',
  'photography',
  'ZEIFUR ROHMAN',
  'JUNE 01, 2026',
  'Fotografi adalah seni menangkap momen berharga yang menceritakan sebuah kisah tanpa kata-kata. Pelajari teknik komposisi cahaya dan framing untuk menghasilkan karya visual bercerita.',
  'Photography is the art of capturing precious moments that tell a story without words. Learn lighting composition techniques and framing to craft visual storytelling.',
  '<h3>Teknik Framing & Esensi Visual</h3><p>Melalui kamera, kita membekukan fragmen waktu menjadi kenangan abadi...</p>',
  '<h3>Framing Techniques & Visual Essence</h3><p>Through the lens, we freeze fragments of time into everlasting memories...</p>',
  'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
)
ON DUPLICATE KEY UPDATE `id` = `id`;
