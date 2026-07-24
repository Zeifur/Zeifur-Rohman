<?php
session_start();
require_once 'api/config.php';

// Handle Logout
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    unset($_SESSION['admin_logged_in']);
    session_destroy();
    header('Location: admin.php');
    exit;
}

// Handle Login Form Submission
$loginError = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login_password'])) {
    if ($_POST['login_password'] === ADMIN_PASSWORD) {
        $_SESSION['admin_logged_in'] = true;
        header('Location: admin.php');
        exit;
    } else {
        $loginError = 'Password salah. Silakan coba lagi.';
    }
}

// Access Control check
$isLoggedIn = isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;

// Handle CRUD operations if logged in
$db = getDbConnection();
$crudError = '';
$crudSuccess = '';

if ($isLoggedIn && $db) {
    // 1. Auto-migration: Products table
    $colCheck = $db->query("SHOW COLUMNS FROM `products` LIKE 'image_url'");
    if ($colCheck && $colCheck->num_rows === 0) {
        @$db->query("ALTER TABLE `products` ADD COLUMN `image_url` VARCHAR(255) NULL AFTER `payment_link`");
    }

    // Auto-seed CapKarya if missing from products table
    $capCheck = $db->query("SELECT `id` FROM `products` WHERE `id` = 2 OR `title_id` LIKE '%CapKarya%'");
    if ($capCheck && $capCheck->num_rows === 0) {
        @$db->query("INSERT INTO `products` (`id`, `title_id`, `title_en`, `desc_id`, `desc_en`, `features_id`, `features_en`, `price`, `price_string`, `class_name`, `icon_name`, `category_name`, `tags`, `payment_link`, `image_url`) VALUES (2, 'CapKarya by Zeifur Rohman (Web App Monogram)', 'CapKarya by Zeifur Rohman (Monogram Web App)', 'Aplikasi web generator logo monogram & identitas visual instan berbasis browser yang dirancang khusus oleh Zeifur Rohman untuk membantu UMKM, pebisnis, dan kreator menciptakan cap identitas/monogram kelas premium secara presisi.', 'Instant browser-based monogram logo & visual identity web application designed by Zeifur Rohman to empower small businesses, entrepreneurs, and creators to generate premium monogram logos in seconds.', 'Editor Monogram Presisi 320x320px | Kustomisasi Inisial 2-3 Huruf & Tagline | Kontrol Rotasi Sudut & Skala Ukuran | Simpan Desain Favorit & Ekspor Aset | 100% Gratis Digunakan', '320x320px Precision Monogram Canvas | 2-3 Letter Monogram & Tagline Builder | Rotation Angle & Scale Controls | Local Favorites Saver & Asset Export | 100% Free to Use', 0.00, 'GRATIS (FREE DEMO)', 'preview-template-1', 'globe', 'free-web', 'CapKarya,WebApp,Monogram,Generator', 'http://capkarya.great-site.net', 'assets/images/capkarya-display-1.png')");
    }

    // 2. Auto-migration: Blogs table
    $db->query("CREATE TABLE IF NOT EXISTS `blogs` (
      `id` INT AUTO_INCREMENT PRIMARY KEY,
      `slug` VARCHAR(255) NOT NULL,
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // Auto-seed default blogs if blogs table is empty
    $blogCheck = $db->query("SELECT COUNT(*) as cnt FROM `blogs`");
    if ($blogCheck && ($row = $blogCheck->fetch_assoc()) && intval($row['cnt']) === 0) {
        @$db->query("INSERT INTO `blogs` (`id`, `slug`, `title_id`, `title_en`, `category`, `tags`, `author`, `created_date`, `excerpt_id`, `excerpt_en`, `content_id`, `content_en`, `image_url`) VALUES
        (1, 'strategi-pengembangan-website-modern', 'STRATEGI PENGEMBANGAN WEBSITE MODERN YANG CEPAT DAN RESPONSIF', 'MODERN WEB DEVELOPMENT STRATEGY FOR HIGH SPEED AND RESPONSIVENESS', 'website', 'branding,website', 'ZEIFUR ROHMAN', 'JUNE 08, 2026', 'Dalam era digital saat ini, performa dan aksesibilitas website adalah kunci keberhasilan bisnis. Pelajari bagaimana memadukan vanilla JavaScript, animasi GSAP, dan optimalisasi Core Web Vitals.', 'In todays digital era, website performance and accessibility are key to business success. Learn how to blend vanilla JavaScript, GSAP animations, and Core Web Vitals optimization.', '<h3>Metodologi Clean Code & Performa Utama</h3><p>Membangun website modern tidak lagi sekadar tentang visual yang indah, melainkan tentang kecepatan muat halaman dan struktur kode yang efisien...</p>', '<h3>Clean Code Methodology & Peak Performance</h3><p>Building modern websites is no longer just about aesthetics, but page load speed and efficient code architecture...</p>', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'),
        (2, 'filosofi-branding-visual-identitas-logo', 'FILOSOFI BRANDING VISUAL: MENERJEMAHKAN VISI MENJADI IDENTITAS LOGO', 'VISUAL BRANDING PHILOSOPHY: TRANSLATING VISION INTO LOGO IDENTITY', 'branding', 'branding', 'ZEIFUR ROHMAN', 'JUNE 05, 2026', 'Logo bukan sekadar gambar, melainkan sebuah representasi filosofis dari visi dan misi suatu brand. Penting untuk melakukan riset audiens dan merumuskan panduan brand digital yang komprehensif.', 'A logo is not just an image, but a philosophical representation of a brands vision and mission. It is vital to perform audience research and formulate comprehensive brand guidelines.', '<h3>Eksplorasi Monogram & Identitas Visual</h3><p>Setiap garis dan warna dalam desain logo memiliki bobot emosional dan daya pikat bisnis...</p>', '<h3>Monogram Exploration & Visual Identity</h3><p>Every line and color in logo design holds emotional weight and business appeal...</p>', 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'),
        (3, 'seni-fotografi-dokumenter-dan-penceritaan-visual', 'SENI FOTOGRAFI DOKUMENTER DAN PENCERITAAN VISUAL', 'THE ART OF DOCUMENTARY PHOTOGRAPHY AND VISUAL STORYTELLING', 'photography', 'photography', 'ZEIFUR ROHMAN', 'JUNE 01, 2026', 'Fotografi adalah seni menangkap momen berharga yang menceritakan sebuah kisah tanpa kata-kata. Pelajari teknik komposisi cahaya dan framing untuk menghasilkan karya visual bercerita.', 'Photography is the art of capturing precious moments that tell a story without words. Learn lighting composition techniques and framing to craft visual storytelling.', '<h3>Teknik Framing & Esensi Visual</h3><p>Melalui kamera, kita membekukan fragmen waktu menjadi kenangan abadi...</p>', '<h3>Framing Techniques & Visual Essence</h3><p>Through the lens, we freeze fragments of time into everlasting memories...</p>', 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')");
    }

    // Ensure upload directories exist
    $uploadDirProd = 'uploads/products/';
    $uploadDirBlog = 'uploads/blogs/';
    if (!file_exists($uploadDirProd)) @mkdir($uploadDirProd, 0777, true);
    if (!file_exists($uploadDirBlog)) @mkdir($uploadDirBlog, 0777, true);

    // ==========================================
    // PRODUCT CRUD HANDLERS
    // ==========================================
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && in_array($_POST['action'], ['add', 'edit'])) {
        $action = $_POST['action'];
        $title_id = trim($_POST['title_id'] ?? '');
        $title_en = trim($_POST['title_en'] ?? '');
        $desc_id = trim($_POST['desc_id'] ?? '');
        $desc_en = trim($_POST['desc_en'] ?? '');
        $features_id = trim($_POST['features_id'] ?? '');
        $features_en = trim($_POST['features_en'] ?? '');
        $price = floatval($_POST['price'] ?? 0);
        $price_string = ($price == 0) ? 'GRATIS (FREE DEMO)' : ("Rp " . number_format($price, 0, ',', '.'));
        $class_name = trim($_POST['class_name'] ?? 'preview-presets');
        $icon_name = trim($_POST['icon_name'] ?? 'coffee');
        $category_name = trim($_POST['category_name'] ?? 'templates');
        $tags = trim($_POST['tags'] ?? 'Vite,GSAP');
        $payment_link = trim($_POST['payment_link'] ?? '');
        $image_url = trim($_POST['image_url_text'] ?? '');
        
        if (isset($_FILES['product_image']) && $_FILES['product_image']['error'] === UPLOAD_ERR_OK) {
            $fileTmpPath = $_FILES['product_image']['tmp_name'];
            $fileName = $_FILES['product_image']['name'];
            $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
            
            $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
            if (in_array($fileExtension, $allowedExtensions)) {
                $newFileName = 'prod_' . time() . '_' . substr(md5(uniqid()), 0, 8) . '.' . $fileExtension;
                $destPath = $uploadDirProd . $newFileName;
                if (move_uploaded_file($fileTmpPath, $destPath)) {
                    $image_url = $destPath;
                }
            } else {
                $crudError = 'Format file gambar tidak didukung. Gunakan JPG, PNG, WEBP, GIF, atau SVG.';
            }
        }
        
        if (empty($title_id) || empty($title_en) || empty($desc_id) || empty($desc_en) || $price < 0 || empty($payment_link)) {
            $crudError = 'Judul, deskripsi, harga, dan payment link wajib diisi.';
        } else {
            if ($action === 'add') {
                $stmt = $db->prepare("INSERT INTO `products` (`title_id`, `title_en`, `desc_id`, `desc_en`, `features_id`, `features_en`, `price`, `price_string`, `class_name`, `icon_name`, `category_name`, `tags`, `payment_link`, `image_url`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->bind_param("ssssssdsssssss", $title_id, $title_en, $desc_id, $desc_en, $features_id, $features_en, $price, $price_string, $class_name, $icon_name, $category_name, $tags, $payment_link, $image_url);
                if ($stmt->execute()) {
                    $crudSuccess = 'Produk berhasil ditambahkan!';
                } else {
                    $crudError = 'Gagal menambahkan produk: ' . $stmt->error;
                }
                $stmt->close();
            } elseif ($action === 'edit') {
                $id = intval($_POST['id']);
                if (empty($image_url)) {
                    $existingCheck = $db->query("SELECT * FROM `products` WHERE `id` = $id");
                    if ($existingCheck && $row = $existingCheck->fetch_assoc()) {
                        $image_url = !empty($row['image_url']) ? $row['image_url'] : ($row['image'] ?? '');
                    }
                }
                
                $stmt = $db->prepare("UPDATE `products` SET `title_id` = ?, `title_en` = ?, `desc_id` = ?, `desc_en` = ?, `features_id` = ?, `features_en` = ?, `price` = ?, `price_string` = ?, `class_name` = ?, `icon_name` = ?, `category_name` = ?, `tags` = ?, `payment_link` = ?, `image_url` = ? WHERE `id` = ?");
                $stmt->bind_param("ssssssdsssssssi", $title_id, $title_en, $desc_id, $desc_en, $features_id, $features_en, $price, $price_string, $class_name, $icon_name, $category_name, $tags, $payment_link, $image_url, $id);
                if ($stmt->execute()) {
                    $crudSuccess = 'Produk berhasil diperbarui!';
                } else {
                    $crudError = 'Gagal memperbarui produk: ' . $stmt->error;
                }
                $stmt->close();
            }
        }
    }

    if (isset($_GET['action']) && $_GET['action'] === 'delete' && isset($_GET['id'])) {
        $id = intval($_GET['id']);
        if ($id === 1) {
            $crudError = 'Produk Traktir Kopi adalah produk sistem dan tidak dapat dihapus.';
        } else {
            $stmt = $db->prepare("DELETE FROM `products` WHERE `id` = ?");
            $stmt->bind_param("i", $id);
            if ($stmt->execute()) {
                $crudSuccess = 'Produk berhasil dihapus!';
            } else {
                $crudError = 'Gagal menghapus produk: ' . $stmt->error;
            }
            $stmt->close();
        }
    }

    // ==========================================
    // BLOG CRUD HANDLERS
    // ==========================================
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && in_array($_POST['action'], ['add_blog', 'edit_blog'])) {
        $action = $_POST['action'];
        $title_id = trim($_POST['blog_title_id'] ?? '');
        $title_en = trim($_POST['blog_title_en'] ?? '');
        $category = trim($_POST['blog_category'] ?? 'website');
        $tags = trim($_POST['blog_tags'] ?? 'website,branding');
        $author = trim($_POST['blog_author'] ?? 'ZEIFUR ROHMAN');
        $created_date = trim($_POST['blog_date'] ?? date('F d, Y'));
        $excerpt_id = trim($_POST['blog_excerpt_id'] ?? '');
        $excerpt_en = trim($_POST['blog_excerpt_en'] ?? '');
        $content_id = trim($_POST['blog_content_id'] ?? '');
        $content_en = trim($_POST['blog_content_en'] ?? '');
        $image_url = trim($_POST['blog_image_url_text'] ?? '');
        
        // Generate clean URL slug from Indonesian title
        $slug = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $title_id));
        $slug = trim($slug, '-');

        if (isset($_FILES['blog_image']) && $_FILES['blog_image']['error'] === UPLOAD_ERR_OK) {
            $fileTmpPath = $_FILES['blog_image']['tmp_name'];
            $fileName = $_FILES['blog_image']['name'];
            $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
            
            $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
            if (in_array($fileExtension, $allowedExtensions)) {
                $newFileName = 'blog_' . time() . '_' . substr(md5(uniqid()), 0, 8) . '.' . $fileExtension;
                $destPath = $uploadDirBlog . $newFileName;
                if (move_uploaded_file($fileTmpPath, $destPath)) {
                    $image_url = $destPath;
                }
            } else {
                $crudError = 'Format file gambar artikel tidak didukung. Gunakan JPG, PNG, WEBP, GIF, atau SVG.';
            }
        }

        if (empty($title_id) || empty($title_en) || empty($excerpt_id) || empty($content_id)) {
            $crudError = 'Judul, ringkasan, dan konten artikel wajib diisi.';
        } else {
            if ($action === 'add_blog') {
                $stmt = $db->prepare("INSERT INTO `blogs` (`slug`, `title_id`, `title_en`, `category`, `tags`, `author`, `created_date`, `excerpt_id`, `excerpt_en`, `content_id`, `content_en`, `image_url`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->bind_param("ssssssssssss", $slug, $title_id, $title_en, $category, $tags, $author, $created_date, $excerpt_id, $excerpt_en, $content_id, $content_en, $image_url);
                if ($stmt->execute()) {
                    $crudSuccess = 'Artikel blog berhasil diterbitkan!';
                } else {
                    $crudError = 'Gagal menerbitkan artikel blog: ' . $stmt->error;
                }
                $stmt->close();
            } elseif ($action === 'edit_blog') {
                $id = intval($_POST['blog_id']);
                if (empty($image_url)) {
                    $existingCheck = $db->query("SELECT * FROM `blogs` WHERE `id` = $id");
                    if ($existingCheck && $row = $existingCheck->fetch_assoc()) {
                        $image_url = $row['image_url'] ?? '';
                    }
                }
                $stmt = $db->prepare("UPDATE `blogs` SET `slug` = ?, `title_id` = ?, `title_en` = ?, `category` = ?, `tags` = ?, `author` = ?, `created_date` = ?, `excerpt_id` = ?, `excerpt_en` = ?, `content_id` = ?, `content_en` = ?, `image_url` = ? WHERE `id` = ?");
                $stmt->bind_param("ssssssssssssi", $slug, $title_id, $title_en, $category, $tags, $author, $created_date, $excerpt_id, $excerpt_en, $content_id, $content_en, $image_url, $id);
                if ($stmt->execute()) {
                    $crudSuccess = 'Artikel blog berhasil diperbarui!';
                } else {
                    $crudError = 'Gagal memperbarui artikel blog: ' . $stmt->error;
                }
                $stmt->close();
            }
        }
    }

    if (isset($_GET['action']) && $_GET['action'] === 'delete_blog' && isset($_GET['id'])) {
        $id = intval($_GET['id']);
        $stmt = $db->prepare("DELETE FROM `blogs` WHERE `id` = ?");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            $crudSuccess = 'Artikel blog berhasil dihapus!';
        } else {
            $crudError = 'Gagal menghapus artikel blog: ' . $stmt->error;
        }
        $stmt->close();
    }
}

// Fetch products & blogs list if logged in
$products = [];
$blogsList = [];
$coffeeProduct = null;

if ($isLoggedIn && $db) {
    $resProd = $db->query("SELECT * FROM `products` ORDER BY `id` DESC");
    if ($resProd) {
        while ($row = $resProd->fetch_assoc()) {
            if (intval($row['id']) === 1) {
                $coffeeProduct = $row;
            } else {
                $products[] = $row;
            }
        }
        $resProd->free();
    }

    $resBlog = $db->query("SELECT * FROM `blogs` ORDER BY `id` DESC");
    if ($resBlog) {
        while ($row = $resBlog->fetch_assoc()) {
            $blogsList[] = $row;
        }
        $resBlog->free();
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Zeifur Rohman</title>
    <!-- Theme & Web App Colors -->
    <meta name="theme-color" content="#980000">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <link rel="icon" type="image/x-icon" href="assets/logo.ico">
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&family=Outfit:wght@300;400;500;700;900&display=swap" rel="stylesheet">
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        :root {
            --bg-color: #060808;
            --card-bg: rgba(20, 22, 22, 0.7);
            --border-color: rgba(255, 255, 255, 0.08);
            --accent-color: #980000;
            --accent-hover: #b00000;
            --text-main: #efefef;
            --muted-text: #8a8d90;
            --transition-smooth: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            background-color: var(--bg-color);
            color: var(--text-main);
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            background-image: 
                radial-gradient(var(--accent-color) 0.5px, transparent 0.5px), 
                radial-gradient(rgba(255, 255, 255, 0.02) 0.5px, transparent 0.5px);
            background-size: 40px 40px;
            background-position: 0 0, 20px 20px;
        }

        .container {
            width: 100%;
            max-width: 1240px;
            margin: 0 auto;
            padding: 40px 20px;
            flex-grow: 1;
        }

        .admin-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 25px;
            border-bottom: 1px solid var(--border-color);
            margin-bottom: 25px;
        }

        .header-title-box { display: flex; align-items: center; gap: 15px; }
        .logo-symbol {
            width: 44px; height: 44px; background: var(--accent-color); color: #fff;
            font-family: 'Outfit', sans-serif; font-weight: 900; font-size: 1.4rem;
            display: flex; align-items: center; justify-content: center; border-radius: 0 0 12px 0;
            box-shadow: 0 0 15px rgba(152, 0, 0, 0.5);
        }
        .header-title-box h1 { font-family: 'Outfit', sans-serif; font-size: 1.6rem; font-weight: 900; }
        .header-title-box h1 span { color: var(--accent-color); }

        .btn-logout {
            background: transparent; border: 1px solid var(--border-color); color: var(--text-main);
            padding: 8px 16px; border-radius: 6px; font-weight: 600; font-size: 0.85rem;
            cursor: pointer; display: flex; align-items: center; gap: 8px; text-decoration: none;
            transition: var(--transition-smooth);
        }
        .btn-logout:hover { background: rgba(255,255,255,0.05); border-color: var(--accent-color); color: #ff6b6b; }

        /* TABS SYSTEM NAVIGATION */
        .admin-tabs-nav {
            display: flex;
            gap: 12px;
            margin-bottom: 30px;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 12px;
            flex-wrap: wrap;
        }

        .tab-nav-btn {
            background: rgba(20, 22, 22, 0.6);
            border: 1px solid var(--border-color);
            color: var(--muted-text);
            padding: 12px 24px;
            border-radius: 8px;
            font-family: 'Outfit', sans-serif;
            font-weight: 700;
            font-size: 0.9rem;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            transition: var(--transition-smooth);
            letter-spacing: 0.05em;
        }

        .tab-nav-btn:hover, .tab-nav-btn.active {
            background: var(--accent-color);
            border-color: var(--accent-color);
            color: #fff;
            box-shadow: 0 0 20px rgba(152, 0, 0, 0.4);
        }

        .tab-content-panel { display: none; }
        .tab-content-panel.active { display: block; }

        .dashboard-grid { display: grid; grid-template-columns: 1fr; gap: 30px; }
        @media (min-width: 992px) { .dashboard-grid { grid-template-columns: 1.4fr 1fr; } }

        .dashboard-card {
            background: var(--card-bg); border: 1px solid var(--border-color);
            border-radius: 0 0 20px 0; padding: 25px; margin-bottom: 30px; backdrop-filter: blur(10px);
        }
        .card-header {
            display: flex; justify-content: space-between; align-items: center;
            padding-bottom: 15px; border-bottom: 1px solid var(--border-color); margin-bottom: 20px;
        }
        .card-title { font-family: 'Outfit', sans-serif; font-size: 1.1rem; font-weight: 700; display: flex; align-items: center; gap: 10px; }

        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; font-size: 0.85rem; font-weight: 600; color: var(--muted-text); margin-bottom: 8px; }
        .form-input {
            width: 100%; background: rgba(0, 0, 0, 0.5); border: 1px solid var(--border-color);
            color: var(--text-main); padding: 12px 15px; border-radius: 6px; font-family: inherit; font-size: 0.9rem;
            transition: var(--transition-smooth); outline: none;
        }
        .form-input:focus { border-color: var(--accent-color); box-shadow: 0 0 10px rgba(152, 0, 0, 0.3); }

        .btn-primary {
            background: var(--accent-color); border: none; color: #fff; padding: 12px 24px; border-radius: 6px;
            font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 0.9rem; cursor: pointer;
            width: 100%; display: flex; justify-content: center; align-items: center; gap: 8px;
            transition: var(--transition-smooth); box-shadow: 0 0 15px rgba(152, 0, 0, 0.4);
        }
        .btn-primary:hover { background: var(--accent-hover); box-shadow: 0 0 25px rgba(152, 0, 0, 0.7); }

        .product-table-wrapper { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem; }
        th { padding: 12px 15px; background: rgba(0, 0, 0, 0.4); color: var(--muted-text); font-weight: 600; border-bottom: 1px solid var(--border-color); }
        td { padding: 15px; border-bottom: 1px solid rgba(255, 255, 255, 0.04); vertical-align: middle; }
        tr:hover td { background: rgba(255, 255, 255, 0.02); }

        .tbl-product-meta { display: flex; align-items: center; gap: 12px; }
        .tbl-badge { display: inline-block; font-size: 0.7rem; padding: 3px 8px; border-radius: 4px; font-weight: 700; text-transform: uppercase; background: rgba(255,255,255,0.05); color: var(--muted-text); }
        .action-cell { display: flex; gap: 8px; }
        .btn-tbl-action { background: transparent; border: 1px solid var(--border-color); color: var(--text-main); width: 32px; height: 32px; border-radius: 6px; cursor: pointer; display: flex; justify-content: center; align-items: center; transition: var(--transition-smooth); }
        .btn-tbl-action:hover { background: var(--accent-color); border-color: var(--accent-color); }
        .btn-tbl-action.btn-del:hover { background: #d93838; border-color: #d93838; }

        .error-message { background: rgba(217, 56, 56, 0.15); border: 1px solid #d93838; color: #ff6b6b; padding: 15px; border-radius: 6px; margin-bottom: 25px; font-size: 0.9rem; }
        .success-message { background: rgba(46, 204, 113, 0.15); border: 1px solid #2ecc71; color: #2ecc71; padding: 15px; border-radius: 6px; margin-bottom: 25px; font-size: 0.9rem; }

        .login-box { max-width: 400px; margin: 80px auto; background: var(--card-bg); border: 1px solid var(--border-color); padding: 40px; border-radius: 0 0 24px 0; text-align: center; backdrop-filter: blur(10px); }
        .login-logo { font-family: 'Outfit', sans-serif; font-size: 2rem; font-weight: 900; margin-bottom: 10px; }
        .login-logo span { color: var(--accent-color); }
    </style>
</head>
<body>

    <div class="container">
        <?php if (!$isLoggedIn): ?>
            <!-- Login Block -->
            <div class="login-box">
                <div class="login-logo">ZEIFUR<span>ROHMAN</span></div>
                <h4 style="color:var(--muted-text);font-size:0.85rem;margin-bottom:30px;letter-spacing:1px;text-transform:uppercase;">Admin Login</h4>
                
                <?php if ($loginError): ?>
                    <div class="error-message"><?php echo $loginError; ?></div>
                <?php endif; ?>
                
                <form method="POST" action="admin.php">
                    <div class="form-group">
                        <label for="login_password">Password Admin</label>
                        <input type="password" id="login_password" name="login_password" class="form-input" required placeholder="Masukkan password...">
                    </div>
                    <button type="submit" class="btn-primary">
                        <i data-lucide="lock" style="width:16px;height:16px;"></i> MASUK KE DASHBOARD
                    </button>
                </form>
            </div>
            
        <?php else: ?>
            <!-- Dashboard Header Block -->
            <header class="admin-header">
                <div class="header-title-box">
                    <div class="logo-symbol">Z</div>
                    <div>
                        <h1>Dashboard <span>Admin</span></h1>
                        <p style="font-size: 0.8rem; color: var(--muted-text);">Kelola katalog toko & artikel blog Zeifur Rohman secara langsung</p>
                    </div>
                </div>
                <a href="admin.php?action=logout" class="btn-logout">
                    <i data-lucide="log-out" style="width:16px;height:16px;"></i> Logout
                </a>
            </header>

            <?php if ($crudSuccess): ?><div class="success-message"><?php echo $crudSuccess; ?></div><?php endif; ?>
            <?php if ($crudError): ?><div class="error-message"><?php echo $crudError; ?></div><?php endif; ?>

            <!-- Navigation Tabs: Products vs Blogs -->
            <div class="admin-tabs-nav">
                <button type="button" class="tab-nav-btn active" id="btn-tab-products" onclick="switchAdminTab('products')">
                    <i data-lucide="package" style="width:18px;height:18px;"></i> PRODUK DIGITAL & WEBSITES
                </button>
                <button type="button" class="tab-nav-btn" id="btn-tab-blogs" onclick="switchAdminTab('blogs')">
                    <i data-lucide="file-text" style="width:18px;height:18px;"></i> MANAJEMEN BLOG ARTIKEL
                </button>
            </div>

            <!-- TAB SECTION 1: PRODUCTS MANAGEMENT -->
            <div class="tab-content-panel active" id="tab-panel-products">
                <div class="dashboard-grid">
                    <!-- Left: Catalog List -->
                    <div>
                        <!-- Special Coffee Treat Settings Card -->
                        <?php if ($coffeeProduct): ?>
                            <div class="dashboard-card" style="border-left: 4px solid #d97706; background: rgba(217, 119, 6, 0.03);">
                                <div class="card-header" style="border-bottom-color: rgba(217, 119, 6, 0.15); margin-bottom: 15px; padding-bottom: 10px;">
                                    <h3 class="card-title" style="color: #f59e0b;"><i data-lucide="coffee"></i> Donasi Traktir Kopi</h3>
                                    <span class="tbl-badge" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24;">Donasi DOKU</span>
                                </div>
                                <div style="display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap;">
                                    <div style="flex-grow: 1;">
                                        <h4 style="color: #fff; font-size: 0.95rem; margin-bottom: 4px; font-weight: 700;"><?php echo htmlspecialchars($coffeeProduct['title_id']); ?></h4>
                                        <div style="font-size: 0.8rem; color: var(--muted-text);">Harga: <strong style="color:#fff;"><?php echo htmlspecialchars($coffeeProduct['price_string']); ?></strong> | Link DOKU: <a href="<?php echo htmlspecialchars($coffeeProduct['payment_link']); ?>" target="_blank" style="color:#f59e0b;"><?php echo htmlspecialchars($coffeeProduct['payment_link']); ?></a></div>
                                    </div>
                                    <button class="btn-primary" onclick="editProduct(<?php echo htmlspecialchars(json_encode($coffeeProduct)); ?>)" style="background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); color: #fbbf24; width: auto; padding: 8px 16px;">
                                        <i data-lucide="edit-3" style="width:14px;height:14px;"></i> EDIT KOPI
                                    </button>
                                </div>
                            </div>
                        <?php endif; ?>

                        <!-- Product List Table -->
                        <div class="dashboard-card">
                            <div class="card-header">
                                <h3 class="card-title"><i data-lucide="package" style="color:var(--accent-color);"></i> Daftar Produk & Karya Web</h3>
                            </div>
                            <div class="product-table-wrapper">
                                <?php if (empty($products)): ?>
                                    <p style="color: var(--muted-text); text-align: center; padding: 20px;">Belum ada produk. Silakan tambahkan dari form di kanan.</p>
                                <?php else: ?>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Item</th>
                                                <th>Kategori</th>
                                                <th>Harga</th>
                                                <th>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php foreach ($products as $prod): ?>
                                                <tr>
                                                    <td>
                                                        <div class="tbl-product-meta">
                                                            <div style="overflow:hidden; border-radius:6px; background:#111; width:36px; height:36px; display:flex; align-items:center; justify-content:center;">
                                                                <?php if (!empty($prod['image_url'])): ?>
                                                                    <img src="<?php echo htmlspecialchars($prod['image_url']); ?>" alt="Thumb" style="width:100%;height:100%;object-fit:cover;">
                                                                <?php else: ?>
                                                                    <i data-lucide="<?php echo htmlspecialchars($prod['icon_name']); ?>" style="width:18px;height:18px;"></i>
                                                                <?php endif; ?>
                                                            </div>
                                                            <div>
                                                                <strong style="color:#fff; display:block;"><?php echo htmlspecialchars($prod['title_id']); ?></strong>
                                                                <span style="font-size:0.75rem;color:var(--muted-text);"><?php echo htmlspecialchars($prod['tags']); ?></span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td><span class="tbl-badge"><?php echo htmlspecialchars($prod['category_name']); ?></span></td>
                                                    <td style="font-weight:700; color:#fff;"><?php echo htmlspecialchars($prod['price_string']); ?></td>
                                                    <td>
                                                        <div class="action-cell">
                                                            <button class="btn-tbl-action" onclick="editProduct(<?php echo htmlspecialchars(json_encode($prod)); ?>)"><i data-lucide="edit-2" style="width:14px;height:14px;"></i></button>
                                                            <a href="admin.php?action=delete&id=<?php echo $prod['id']; ?>" class="btn-tbl-action btn-del" onclick="return confirm('Hapus produk ini?')"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></a>
                                                        </div>
                                                    </td>
                                                </tr>
                                            <?php endforeach; ?>
                                        </tbody>
                                    </table>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Product CRUD Form -->
                    <div>
                        <div class="dashboard-card">
                            <div class="card-header">
                                <h3 class="card-title" id="form-product-title"><i data-lucide="plus-circle" style="color:var(--accent-color);"></i> Tambah Produk Baru</h3>
                            </div>
                            <form method="POST" action="admin.php" id="crud-product-form" enctype="multipart/form-data">
                                <input type="hidden" name="action" id="form-action-prod" value="add">
                                <input type="hidden" name="id" id="form-prod-id" value="">

                                <div class="form-group">
                                    <label>Nama Produk (Bahasa Indonesia)</label>
                                    <input type="text" id="title_id" name="title_id" class="form-input" required placeholder="Contoh: Template Website Personal">
                                </div>
                                <div class="form-group">
                                    <label>Nama Produk (Bahasa Inggris)</label>
                                    <input type="text" id="title_en" name="title_en" class="form-input" required placeholder="Contoh: Personal Website Template">
                                </div>
                                <div class="form-group">
                                    <label>Deskripsi (Bahasa Indonesia)</label>
                                    <textarea id="desc_id" name="desc_id" class="form-input" required rows="3"></textarea>
                                </div>
                                <div class="form-group">
                                    <label>Deskripsi (Bahasa Inggris)</label>
                                    <textarea id="desc_en" name="desc_en" class="form-input" required rows="3"></textarea>
                                </div>
                                <div class="form-group">
                                    <label>Harga (Rupiah, 0 untuk Gratis)</label>
                                    <input type="number" id="price" name="price" class="form-input" required placeholder="0">
                                </div>
                                <div class="form-group">
                                    <label>Kategori Item</label>
                                    <select id="category_name" name="category_name" class="form-input">
                                        <option value="free-web">KARYA WEB (DEMO GRATIS)</option>
                                        <option value="templates">TEMPLATE WEB</option>
                                        <option value="branding">ASET BRANDING</option>
                                        <option value="presets">PRESET & UI KIT</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Tags / Label (Pisah Koma)</label>
                                    <input type="text" id="tags" name="tags" class="form-input" placeholder="CapKarya,WebApp,Monogram">
                                </div>
                                <div class="form-group">
                                    <label>Upload File Gambar Display</label>
                                    <input type="file" id="product_image" name="product_image" accept="image/*" class="form-input">
                                    <input type="text" id="image_url_text" name="image_url_text" class="form-input" placeholder="Atau URL gambar..." style="margin-top:8px;">
                                </div>
                                <div class="form-group">
                                    <label>Link Website Demo / DOKU Payment</label>
                                    <input type="url" id="payment_link" name="payment_link" class="form-input" required placeholder="http://capkarya.great-site.net">
                                </div>

                                <div style="display:flex;gap:12px;">
                                    <button type="submit" class="btn-primary" id="btn-submit-prod"><i data-lucide="save" style="width:16px;height:16px;"></i> SIMPAN PRODUK</button>
                                    <button type="button" class="btn-logout" id="btn-cancel-prod" style="display:none;" onclick="resetProductForm()">Batal</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <!-- TAB SECTION 2: BLOGS MANAGEMENT -->
            <div class="tab-content-panel" id="tab-panel-blogs">
                <div class="dashboard-grid">
                    <!-- Left: Blog List -->
                    <div>
                        <div class="dashboard-card">
                            <div class="card-header">
                                <h3 class="card-title"><i data-lucide="file-text" style="color:var(--accent-color);"></i> Daftar Artikel Blog Terbit</h3>
                            </div>
                            <div class="product-table-wrapper">
                                <?php if (empty($blogsList)): ?>
                                    <p style="color: var(--muted-text); text-align: center; padding: 20px;">Belum ada artikel blog. Silakan unggah dari form di sebelah kanan.</p>
                                <?php else: ?>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Artikel Blog</th>
                                                <th>Kategori</th>
                                                <th>Tanggal</th>
                                                <th>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php foreach ($blogsList as $b): ?>
                                                <tr>
                                                    <td>
                                                        <div class="tbl-product-meta">
                                                            <div style="overflow:hidden; border-radius:6px; background:#111; width:44px; height:44px; flex-shrink:0;">
                                                                <?php if (!empty($b['image_url'])): ?>
                                                                    <img src="<?php echo htmlspecialchars($b['image_url']); ?>" alt="Thumb" style="width:100%;height:100%;object-fit:cover;">
                                                                <?php else: ?>
                                                                    <i data-lucide="file-text" style="width:20px;height:20px;margin:12px auto;display:block;"></i>
                                                                <?php endif; ?>
                                                            </div>
                                                            <div>
                                                                <strong style="color:#fff; display:block; line-height:1.3; font-size:0.88rem;"><?php echo htmlspecialchars($b['title_id']); ?></strong>
                                                                <span style="font-size:0.75rem;color:var(--muted-text);">By: <?php echo htmlspecialchars($b['author']); ?> | Slug: <?php echo htmlspecialchars($b['slug']); ?></span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td><span class="tbl-badge"><?php echo htmlspecialchars($b['category']); ?></span></td>
                                                    <td style="font-size:0.8rem; color:var(--muted-text);"><?php echo htmlspecialchars($b['created_date']); ?></td>
                                                    <td>
                                                        <div class="action-cell">
                                                            <button class="btn-tbl-action" onclick="editBlog(<?php echo htmlspecialchars(json_encode($b)); ?>)"><i data-lucide="edit-2" style="width:14px;height:14px;"></i></button>
                                                            <a href="admin.php?action=delete_blog&id=<?php echo $b['id']; ?>" class="btn-tbl-action btn-del" onclick="return confirm('Hapus artikel blog ini?')"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></a>
                                                        </div>
                                                    </td>
                                                </tr>
                                            <?php endforeach; ?>
                                        </tbody>
                                    </table>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Blog CRUD Form -->
                    <div>
                        <div class="dashboard-card">
                            <div class="card-header">
                                <h3 class="card-title" id="form-blog-title"><i data-lucide="plus-circle" style="color:var(--accent-color);"></i> Unggah Artikel Blog Baru</h3>
                            </div>
                            <form method="POST" action="admin.php" id="crud-blog-form" enctype="multipart/form-data">
                                <input type="hidden" name="action" id="form-action-blog" value="add_blog">
                                <input type="hidden" name="blog_id" id="form-blog-id" value="">

                                <div class="form-group">
                                    <label>Judul Artikel (Bahasa Indonesia)</label>
                                    <input type="text" id="blog_title_id" name="blog_title_id" class="form-input" required placeholder="Contoh: Strategi Pengembangan Web Modern">
                                </div>
                                <div class="form-group">
                                    <label>Judul Artikel (Bahasa Inggris)</label>
                                    <input type="text" id="blog_title_en" name="blog_title_en" class="form-input" required placeholder="Contoh: Modern Web Development Strategy">
                                </div>

                                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                                    <div class="form-group">
                                        <label>Kategori Blog</label>
                                        <select id="blog_category" name="blog_category" class="form-input">
                                            <option value="website">WEBSITE & CODING</option>
                                            <option value="branding">BRANDING & DESAIN</option>
                                            <option value="photography">FOTOGRAFI</option>
                                            <option value="tutorial">TUTORIAL & TIPS</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label>Penulis / Author</label>
                                        <input type="text" id="blog_author" name="blog_author" class="form-input" value="ZEIFUR ROHMAN">
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label>Tags Artikel (Pisahkan Koma)</label>
                                    <input type="text" id="blog_tags" name="blog_tags" class="form-input" placeholder="website,branding,design">
                                </div>

                                <div class="form-group">
                                    <label>Tanggal Rilis (Tampil)</label>
                                    <input type="text" id="blog_date" name="blog_date" class="form-input" value="<?php echo strtoupper(date('F d, Y')); ?>">
                                </div>

                                <div class="form-group">
                                    <label>Upload Gambar Utama Artikel</label>
                                    <input type="file" id="blog_image" name="blog_image" accept="image/*" class="form-input">
                                    <input type="text" id="blog_image_url_text" name="blog_image_url_text" class="form-input" placeholder="Atau URL Gambar Unsplash / Cloud..." style="margin-top:6px;">
                                </div>

                                <div class="form-group">
                                    <label>Ringkasan Singkat (Bahasa Indonesia)</label>
                                    <textarea id="blog_excerpt_id" name="blog_excerpt_id" class="form-input" rows="2" required placeholder="Tuliskan rangkuman artikel..."></textarea>
                                </div>
                                <div class="form-group">
                                    <label>Ringkasan Singkat (Bahasa Inggris)</label>
                                    <textarea id="blog_excerpt_en" name="blog_excerpt_en" class="form-input" rows="2" required placeholder="Write summary in English..."></textarea>
                                </div>

                                <div class="form-group">
                                    <label>Isi Lengkap Artikel HTML (Bahasa Indonesia)</label>
                                    <textarea id="blog_content_id" name="blog_content_id" class="form-input" rows="6" required placeholder="<p>Isi paragraf pertama...</p><h3>Sub Judul</h3><p>Paragraf kedua...</p>"></textarea>
                                </div>
                                <div class="form-group">
                                    <label>Isi Lengkap Artikel HTML (Bahasa Inggris)</label>
                                    <textarea id="blog_content_en" name="blog_content_en" class="form-input" rows="6" required placeholder="<p>First paragraph in English...</p><h3>Heading</h3><p>Second paragraph...</p>"></textarea>
                                </div>

                                <div style="display:flex;gap:12px;">
                                    <button type="submit" class="btn-primary" id="btn-submit-blog"><i data-lucide="upload-cloud" style="width:16px;height:16px;"></i> TERBITKAN ARTIKEL</button>
                                    <button type="button" class="btn-logout" id="btn-cancel-blog" style="display:none;" onclick="resetBlogForm()">Batal</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        <?php endif; ?>
    </div>

    <script>
        lucide.createIcons();

        function switchAdminTab(tabName) {
            document.querySelectorAll('.tab-nav-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content-panel').forEach(p => p.classList.remove('active'));

            document.getElementById('btn-tab-' + tabName).classList.add('active');
            document.getElementById('tab-panel-' + tabName).classList.add('active');
        }

        // Product edit handler
        function editProduct(product) {
            switchAdminTab('products');
            document.getElementById('form-product-title').innerHTML = '<i data-lucide="edit-3" style="color:var(--accent-color);"></i> Edit Produk: ' + product.title_id;
            document.getElementById('form-action-prod').value = 'edit';
            document.getElementById('form-prod-id').value = product.id;
            
            document.getElementById('title_id').value = product.title_id;
            document.getElementById('title_en').value = product.title_en;
            document.getElementById('desc_id').value = product.desc_id;
            document.getElementById('desc_en').value = product.desc_en;
            document.getElementById('price').value = parseInt(product.price);
            document.getElementById('category_name').value = product.category_name;
            document.getElementById('tags').value = product.tags;
            document.getElementById('payment_link').value = product.payment_link;
            document.getElementById('image_url_text').value = product.image_url || '';
            
            document.getElementById('btn-submit-prod').innerHTML = '<i data-lucide="refresh-cw" style="width:16px;height:16px;"></i> UPDATE PRODUK';
            document.getElementById('btn-cancel-prod').style.display = 'block';
            lucide.createIcons();
            window.scrollTo({ top: document.getElementById('crud-product-form').offsetTop - 50, behavior: 'smooth' });
        }

        function resetProductForm() {
            document.getElementById('form-product-title').innerHTML = '<i data-lucide="plus-circle" style="color:var(--accent-color);"></i> Tambah Produk Baru';
            document.getElementById('form-action-prod').value = 'add';
            document.getElementById('form-prod-id').value = '';
            document.getElementById('crud-product-form').reset();
            document.getElementById('btn-submit-prod').innerHTML = '<i data-lucide="save" style="width:16px;height:16px;"></i> SIMPAN PRODUK';
            document.getElementById('btn-cancel-prod').style.display = 'none';
        }

        // Blog edit handler
        function editBlog(blog) {
            switchAdminTab('blogs');
            document.getElementById('form-blog-title').innerHTML = '<i data-lucide="edit-3" style="color:var(--accent-color);"></i> Edit Artikel: ' + blog.title_id;
            document.getElementById('form-action-blog').value = 'edit_blog';
            document.getElementById('form-blog-id').value = blog.id;
            
            document.getElementById('blog_title_id').value = blog.title_id;
            document.getElementById('blog_title_en').value = blog.title_en;
            document.getElementById('blog_category').value = blog.category;
            document.getElementById('blog_author').value = blog.author;
            document.getElementById('blog_tags').value = blog.tags;
            document.getElementById('blog_date').value = blog.created_date;
            document.getElementById('blog_excerpt_id').value = blog.excerpt_id;
            document.getElementById('blog_excerpt_en').value = blog.excerpt_en;
            document.getElementById('blog_content_id').value = blog.content_id;
            document.getElementById('blog_content_en').value = blog.content_en;
            document.getElementById('blog_image_url_text').value = blog.image_url || '';
            
            document.getElementById('btn-submit-blog').innerHTML = '<i data-lucide="refresh-cw" style="width:16px;height:16px;"></i> UPDATE ARTIKEL';
            document.getElementById('btn-cancel-blog').style.display = 'block';
            lucide.createIcons();
            window.scrollTo({ top: document.getElementById('crud-blog-form').offsetTop - 50, behavior: 'smooth' });
        }

        function resetBlogForm() {
            document.getElementById('form-blog-title').innerHTML = '<i data-lucide="plus-circle" style="color:var(--accent-color);"></i> Unggah Artikel Blog Baru';
            document.getElementById('form-action-blog').value = 'add_blog';
            document.getElementById('form-blog-id').value = '';
            document.getElementById('crud-blog-form').reset();
            document.getElementById('btn-submit-blog').innerHTML = '<i data-lucide="upload-cloud" style="width:16px;height:16px;"></i> TERBITKAN ARTIKEL';
            document.getElementById('btn-cancel-blog').style.display = 'none';
        }
    </script>
</body>
</html>
