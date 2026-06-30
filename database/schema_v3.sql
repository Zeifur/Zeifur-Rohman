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

-- Seed default coffee treat product into the table
INSERT INTO `products` (`id`, `title_id`, `title_en`, `desc_id`, `desc_en`, `features_id`, `features_en`, `price`, `price_string`, `class_name`, `icon_name`, `category_name`, `tags`, `payment_link`) 
VALUES (
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
  'templates', 
  'React,Vite,GSAP', 
  'https://pay.doku.com/p-link/p/nU6Twy06pX'
) ON DUPLICATE KEY UPDATE `id` = `id`;
