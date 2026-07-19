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
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed default catalog products into the table
INSERT INTO `products` (`id`, `title_id`, `title_en`, `desc_id`, `desc_en`, `features_id`, `features_en`, `price`, `price_string`, `class_name`, `icon_name`, `category_name`, `tags`, `payment_link`) 
VALUES 
(
  1, 
  'Traktir Kopi Kreatif', 
  'Buy Me a Coffee', 
  'Dukung karya dan kreativitas saya dengan mentraktir secangkir kopi hangat senilai Rp 10.000 melalui gerbang pembayaran DOKU.', 
  'Support my creative projects and work by buying me a warm cup of coffee worth Rp 10,000 via DOKU Payment Gateway.', 
  'Secangkir Kopi Hangat | Dukungan Kreator | DOKU Gateway Aktif | Ucapan Terima Kasih', 
  'One Hot Cup of Coffee | Creator Support | Live DOKU Gateway | Heartfelt Appreciation', 
  10000.00, 
  'Rp 10.000', 
  'preview-presets', 
  'coffee', 
  'coffee', 
  'Coffee,Support', 
  'https://pay.doku.com/p-link/p/nU6Twy06pX'
),
(
  2,
  'CapKarya by Zeifur Rohman',
  'CapKarya by Zeifur Rohman',
  'CapKarya adalah aplikasi web generator logo monogram & identitas visual instan berbasis browser yang dirancang khusus oleh Zeifur Rohman untuk membantu UMKM, pebisnis, dan kreator menciptakan cap identitas/monogram kelas premium secara presisi dalam hitungan detik.',
  'CapKarya is an instant browser-based monogram logo & visual identity web application designed by Zeifur Rohman to empower small businesses, entrepreneurs, and creators to generate premium monogram logos in seconds.',
  'Editor Monogram Presisi 320x320px | Kustomisasi Inisial 2-3 Huruf & Tagline | Kontrol Rotasi, Skala & DPAD | Simpan Desain Favorit & Ekspor Aset | 100% Gratis Tanpa Registrasi Rumit',
  '320x320px Precision Monogram Canvas | 2-Letter/3-Letter Monogram & Tagline Builder | Rotation, Scale & DPAD Controls | Favorite Design Saver & Instant Export | 100% Free Without Complex Registration',
  0.00,
  'GRATIS (WEB APP)',
  'preview-branding',
  'sparkles',
  'free-web',
  'Web Dev,JavaScript,Canvas Editor',
  'https://grey-newt-892825.hostingersite.com/'
),
(
  4,
  'Zeifur Studio - Premium Web Template',
  'Zeifur Studio - Premium Web Template',
  'Template website portofolio premium dengan desain sinematik yang dirancang khusus untuk web developer, desainer visual, dan fotografer. Menampilkan transisi GSAP ultra-mulus, SEO ready, dan kode sumber lengkap.',
  'A premium cinematic web portfolio template designed for web developers, visual designers, and photographers. Features high-end GSAP transitions, SEO optimizations, and complete source code.',
  'Transisi GSAP Sinematik | Optimasi SEO & CWV | Form Kontak Fungsional | Source Code & Dokumentasi',
  'Cinematic GSAP Transitions | SEO & CWV Optimized | Functional Contact Form | Complete Source Code & Docs',
  250000.00,
  'Rp 250.000',
  'preview-templates',
  'monitor',
  'templates',
  'React,GSAP,Vite',
  'https://pay.doku.com/p-link/p/nU6Twy06pX'
),
(
  5,
  'Cinematic Lightroom Presets (Wisuda & Sport)',
  'Cinematic Lightroom Presets (Graduation & Sports)',
  'Paket 12 preset Adobe Lightroom (.XMP & .DNG) premium hasil kurasi fotografer tersertifikasi BNSP untuk tone warna hangat sinematik pada foto wisuda, olahraga outdoor, dan dokumentasi travel.',
  'A collection of 12 premium Adobe Lightroom presets (.XMP & .DNG) curated by a certified BNSP photographer for warm cinematic tones on graduation, sports, and travel photos.',
  '12 Presets (.XMP & .DNG) | Tone Hangat & Cinematic | Formulasi Wisuda & Sport | Panduan Instalasi',
  '12 Presets (.XMP & .DNG) | Warm Cinematic Tone | Graduation & Sports Formula | Installation Guide',
  75000.00,
  'Rp 75.000',
  'preview-presets',
  'sliders',
  'presets',
  'Presets,Lightroom',
  'https://pay.doku.com/p-link/p/nU6Twy06pX'
),
(
  6,
  'Visual Branding & Complete UI Kit Bundle',
  'Visual Branding & Complete UI Kit Bundle',
  'Bundle template logo vektor, brand visual guidelines, palet warna adaptif, dan 30+ komponen UI kit minimalis siap pakai dalam format Figma, SVG, dan EPS.',
  'A bundle of vector logo templates, brand visual guidelines, adaptive color palettes, and 30+ minimalist UI kit components in Figma, SVG, and EPS formats.',
  '30+ Komponen UI Figma | Vektor Logo Dapat Diedit | Panduan Tipografi Lengkap | Aset Siap Ekspor',
  '30+ Figma UI Components | Editable Vector Logo Assets | Complete Typography Guide | Ready-to-Export Assets',
  150000.00,
  'Rp 150.000',
  'preview-branding',
  'palette',
  'branding',
  'Figma,Branding',
  'https://pay.doku.com/p-link/p/nU6Twy06pX'
)
ON DUPLICATE KEY UPDATE `id` = `id`;
