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
    // Auto-migration: Check if image_url column exists in products table, add if missing
    $colCheck = $db->query("SHOW COLUMNS FROM `products` LIKE 'image_url'");
    if ($colCheck && $colCheck->num_rows === 0) {
        @$db->query("ALTER TABLE `products` ADD COLUMN `image_url` VARCHAR(255) NULL AFTER `payment_link`");
    }

    // Auto-seed CapKarya if missing from products table
    $capCheck = $db->query("SELECT `id` FROM `products` WHERE `id` = 2 OR `title_id` LIKE '%CapKarya%'");
    if ($capCheck && $capCheck->num_rows === 0) {
        @$db->query("INSERT INTO `products` (`id`, `title_id`, `title_en`, `desc_id`, `desc_en`, `features_id`, `features_en`, `price`, `price_string`, `class_name`, `icon_name`, `category_name`, `tags`, `payment_link`, `image_url`) VALUES (2, 'CapKarya by Zeifur Rohman (Web App Monogram)', 'CapKarya by Zeifur Rohman (Monogram Web App)', 'Aplikasi web generator logo monogram & identitas visual instan berbasis browser yang dirancang khusus oleh Zeifur Rohman untuk membantu UMKM, pebisnis, dan kreator menciptakan cap identitas/monogram kelas premium secara presisi.', 'Instant browser-based monogram logo & visual identity web application designed by Zeifur Rohman to empower small businesses, entrepreneurs, and creators to generate premium monogram logos in seconds.', 'Editor Monogram Presisi 320x320px | Kustomisasi Inisial 2-3 Huruf & Tagline | Kontrol Rotasi Sudut & Skala Ukuran | Simpan Desain Favorit & Ekspor Aset | 100% Gratis Digunakan', '320x320px Precision Monogram Canvas | 2-3 Letter Monogram & Tagline Builder | Rotation Angle & Scale Controls | Local Favorites Saver & Asset Export | 100% Free to Use', 0.00, 'GRATIS (FREE DEMO)', 'preview-template-1', 'globe', 'free-web', 'CapKarya,WebApp,Monogram,Generator', 'http://capkarya.great-site.net', 'assets/images/capkarya-display-1.png')");
    }

    // Ensure upload directory exists
    $uploadDir = 'uploads/products/';
    if (!file_exists($uploadDir)) {
        @mkdir($uploadDir, 0777, true);
    }

    // 1. ADD / EDIT PRODUCT
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
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
        
        // Handle File Upload if provided
        if (isset($_FILES['product_image']) && $_FILES['product_image']['error'] === UPLOAD_ERR_OK) {
            $fileTmpPath = $_FILES['product_image']['tmp_name'];
            $fileName = $_FILES['product_image']['name'];
            $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
            
            $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
            if (in_array($fileExtension, $allowedExtensions)) {
                $newFileName = 'prod_' . time() . '_' . substr(md5(uniqid()), 0, 8) . '.' . $fileExtension;
                $destPath = $uploadDir . $newFileName;
                if (move_uploaded_file($fileTmpPath, $destPath)) {
                    $image_url = $destPath;
                }
            } else {
                $crudError = 'Format file gambar tidak didukung. Gunakan JPG, PNG, WEBP, GIF, atau SVG.';
            }
        }
        
        if (empty($title_id) || empty($title_en) || empty($desc_id) || empty($desc_en) || $price < 0 || empty($payment_link)) {
            $crudError = 'Judul, deskripsi, harga, dan payment link / demo link wajib diisi.';
        } else {
            if ($action === 'add') {
                $stmt = $db->prepare("INSERT INTO `products` (`title_id`, `title_en`, `desc_id`, `desc_en`, `features_id`, `features_en`, `price`, `price_string`, `class_name`, `icon_name`, `category_name`, `tags`, `payment_link`, `image_url`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->bind_param("ssssssdsssssss", $title_id, $title_en, $desc_id, $desc_en, $features_id, $features_en, $price, $price_string, $class_name, $icon_name, $category_name, $tags, $payment_link, $image_url);
                if ($stmt->execute()) {
                    $crudSuccess = 'Produk berhasil ditambahkan!';
                    @$db->query("UPDATE `products` SET `image` = `image_url` WHERE `image_url` IS NOT NULL AND `image_url` != ''");
                    @$db->query("UPDATE `products` SET `image_url` = `image` WHERE `image` IS NOT NULL AND `image` != '' AND (`image_url` IS NULL OR `image_url` = '')");
                } else {
                    $crudError = 'Gagal menambahkan produk: ' . $stmt->error;
                }
                $stmt->close();
            } elseif ($action === 'edit') {
                $id = intval($_POST['id']);
                
                // If editing and no new image upload/URL provided, keep existing image_url from DB
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
                    // Sync image and image_url columns if both exist in MySQL database
                    @$db->query("UPDATE `products` SET `image` = `image_url` WHERE `image_url` IS NOT NULL AND `image_url` != ''");
                    @$db->query("UPDATE `products` SET `image_url` = `image` WHERE `image` IS NOT NULL AND `image` != '' AND (`image_url` IS NULL OR `image_url` = '')");
                } else {
                    $crudError = 'Gagal memperbarui produk: ' . $stmt->error;
                }
                $stmt->close();
            }
        }
    }
    
    // 2. DELETE PRODUCT
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
}

// Fetch products list if logged in
$products = [];
$coffeeProduct = null;
if ($isLoggedIn && $db) {
    $res = $db->query("SELECT * FROM `products` ORDER BY `id` DESC");
    if ($res) {
        while ($row = $res->fetch_assoc()) {
            if (intval($row['id']) === 1) {
                $coffeeProduct = $row;
            } else {
                $products[] = $row;
            }
        }
        $res->free();
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Zeifur Rohman</title>
    <!-- Theme & Web App Colors for macOS Safari and Mobile Browser Header -->
    <meta name="theme-color" content="#980000">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="msapplication-navbutton-color" content="#980000">
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

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

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
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
            flex-grow: 1;
        }

        /* HEADER AREA */
        .admin-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 40px;
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            padding: 20px 30px;
            border-radius: 0 0 24px 0;
            backdrop-filter: blur(10px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .header-title-box {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .logo-symbol {
            width: 40px;
            height: 40px;
            background: var(--accent-color);
            border-radius: 0 0 12px 0;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: 900;
            font-family: 'Outfit', sans-serif;
            color: #fff;
            box-shadow: 0 0 15px var(--accent-color);
        }

        .header-title-box h1 {
            font-family: 'Outfit', sans-serif;
            font-weight: 900;
            font-size: 1.5rem;
            letter-spacing: 1px;
        }

        .header-title-box h1 span {
            color: var(--accent-color);
        }

        .btn-logout {
            background: transparent;
            border: 1px solid var(--border-color);
            color: var(--text-main);
            padding: 8px 16px;
            border-radius: 0 0 8px 0;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 500;
            transition: var(--transition-smooth);
        }

        .btn-logout:hover {
            background: var(--accent-color);
            border-color: var(--accent-color);
            box-shadow: 0 0 15px var(--accent-color);
        }

        /* LOGIN WINDOW */
        .login-box {
            max-width: 400px;
            margin: 100px auto;
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            padding: 40px;
            border-radius: 0 0 32px 0;
            backdrop-filter: blur(10px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.7);
            text-align: center;
        }

        .login-logo {
            font-size: 2rem;
            font-family: 'Outfit', sans-serif;
            font-weight: 900;
            margin-bottom: 30px;
        }

        .login-logo span {
            color: var(--accent-color);
        }

        .form-group {
            margin-bottom: 20px;
            text-align: left;
        }

        .form-group label {
            display: block;
            font-size: 0.85rem;
            color: var(--muted-text);
            margin-bottom: 8px;
            font-weight: 500;
        }

        .form-input {
            width: 100%;
            background: rgba(0,0,0,0.4);
            border: 1px solid var(--border-color);
            color: var(--text-main);
            padding: 12px 16px;
            border-radius: 0 0 12px 0;
            outline: none;
            font-family: 'Inter', sans-serif;
            transition: var(--transition-smooth);
        }

        .form-input:focus {
            border-color: var(--accent-color);
            box-shadow: 0 0 10px rgba(152,0,0,0.2);
        }

        .btn-primary {
            width: 100%;
            background: var(--accent-color);
            border: 1px solid var(--accent-color);
            color: #fff;
            padding: 14px;
            border-radius: 0 0 14px 0;
            font-weight: 700;
            cursor: pointer;
            font-family: 'Outfit', sans-serif;
            letter-spacing: 1px;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            transition: var(--transition-smooth);
        }

        .btn-primary:hover {
            background: var(--accent-hover);
            border-color: var(--accent-hover);
            box-shadow: 0 0 20px var(--accent-color);
        }

        .error-message {
            background: rgba(152,0,0,0.15);
            border: 1px solid var(--accent-color);
            color: #ff6b6b;
            padding: 10px 15px;
            border-radius: 4px;
            font-size: 0.85rem;
            margin-bottom: 20px;
            text-align: left;
        }

        .success-message {
            background: rgba(46,117,89,0.15);
            border: 1px solid #2e7559;
            color: #58d68d;
            padding: 10px 15px;
            border-radius: 4px;
            font-size: 0.85rem;
            margin-bottom: 20px;
            text-align: left;
        }

        /* GRID DASHBOARD */
        .dashboard-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 30px;
        }

        @media (min-width: 900px) {
            .dashboard-grid {
                grid-template-columns: 2fr 1fr;
            }
        }

        .dashboard-card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 0 0 24px 0;
            padding: 30px;
            backdrop-filter: blur(10px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            margin-bottom: 30px;
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 15px;
        }

        .card-title {
            font-family: 'Outfit', sans-serif;
            font-weight: 700;
            font-size: 1.25rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .card-title span {
            color: var(--accent-color);
        }

        /* STATS COMPONENT */
        .stats-row {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .stat-item {
            background: rgba(0,0,0,0.3);
            border: 1px solid var(--border-color);
            border-radius: 0 0 12px 0;
            padding: 20px;
            text-align: center;
        }

        .stat-val {
            font-size: 2rem;
            font-weight: 900;
            font-family: 'Outfit', sans-serif;
            color: var(--accent-color);
            text-shadow: 0 0 10px rgba(152,0,0,0.3);
        }

        .stat-lbl {
            font-size: 0.75rem;
            color: var(--muted-text);
            text-transform: uppercase;
            font-weight: 700;
            margin-top: 5px;
        }

        /* PRODUCTS TABLE */
        .product-table-wrapper {
            width: 100%;
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            font-size: 0.9rem;
        }

        th {
            color: var(--muted-text);
            font-weight: 700;
            padding: 12px 15px;
            border-bottom: 1px solid var(--border-color);
            font-size: 0.8rem;
            text-transform: uppercase;
        }

        td {
            padding: 15px;
            border-bottom: 1px solid var(--border-color);
            vertical-align: middle;
        }

        tr:hover td {
            background: rgba(255,255,255,0.01);
        }

        .tbl-product-meta {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .tbl-product-icon {
            width: 32px;
            height: 32px;
            background: rgba(152,0,0,0.1);
            border: 1px solid rgba(152,0,0,0.3);
            border-radius: 0 0 8px 0;
            display: flex;
            justify-content: center;
            align-items: center;
            color: var(--accent-color);
        }

        .tbl-price {
            font-weight: 700;
            color: #fff;
        }

        .tbl-badge {
            display: inline-block;
            font-size: 0.7rem;
            padding: 3px 8px;
            border-radius: 0 0 6px 0;
            font-weight: 700;
            text-transform: uppercase;
            background: rgba(255,255,255,0.05);
            color: var(--muted-text);
        }

        .tbl-badge.active-badge {
            background: rgba(152,0,0,0.15);
            color: #ff6b6b;
            border: 1px solid rgba(152,0,0,0.2);
        }

        .action-cell {
            display: flex;
            gap: 10px;
        }

        .btn-tbl-action {
            background: transparent;
            border: 1px solid var(--border-color);
            color: var(--text-main);
            width: 32px;
            height: 32px;
            border-radius: 0 0 8px 0;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: var(--transition-smooth);
        }

        .btn-tbl-action:hover {
            background: var(--accent-color);
            border-color: var(--accent-color);
            box-shadow: 0 0 10px var(--accent-color);
        }

        .btn-tbl-action.btn-del:hover {
            background: #d93838;
            border-color: #d93838;
            box-shadow: 0 0 10px #d93838;
        }

        /* CRUD FORM WIDGETS */
        .form-grid-2 {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
        }

        @media (min-width: 700px) {
            .form-grid-2 {
                grid-template-columns: 1fr 1fr;
            }
        }

        textarea.form-input {
            resize: vertical;
            min-height: 100px;
        }

        /* INSTRUCTION PANEL */
        .instruction-box {
            background: rgba(152,0,0,0.05);
            border-left: 4px solid var(--accent-color);
            padding: 20px;
            border-radius: 0 8px 8px 0;
            margin-bottom: 25px;
            font-size: 0.85rem;
        }

        .instruction-box h4 {
            font-family: 'Outfit', sans-serif;
            font-weight: 700;
            color: #fff;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .code-snippet-box {
            background: #000;
            border: 1px solid var(--border-color);
            font-family: monospace;
            padding: 10px 15px;
            border-radius: 6px;
            margin-top: 10px;
            overflow-x: auto;
            font-size: 0.8rem;
            color: #58d68d;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .btn-copy {
            background: rgba(255,255,255,0.05);
            border: 1px solid var(--border-color);
            color: var(--text-main);
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 0.7rem;
            cursor: pointer;
            transition: var(--transition-smooth);
        }

        .btn-copy:hover {
            background: var(--accent-color);
            border-color: var(--accent-color);
        }
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
            <!-- Dashboard Block -->
            <header class="admin-header">
                <div class="header-title-box">
                    <div class="logo-symbol">Z</div>
                    <div>
                        <h1>Dashboard <span>Admin</span></h1>
                        <p style="font-size: 0.8rem; color: var(--muted-text);">Kelola katalog toko & integrasi pembayaran DOKU</p>
                    </div>
                </div>
                <a href="admin.php?action=logout" class="btn-logout">
                    <i data-lucide="log-out" style="width:16px;height:16px;"></i> Logout
                </a>
            </header>

            <?php if ($crudSuccess): ?>
                <div class="success-message"><?php echo $crudSuccess; ?></div>
            <?php endif; ?>
            <?php if ($crudError): ?>
                <div class="error-message"><?php echo $crudError; ?></div>
            <?php endif; ?>

            <div class="stats-row">
                <div class="stat-item">
                    <div class="stat-val"><?php echo count($products); ?></div>
                    <div class="stat-lbl">Total Item</div>
                </div>
                <div class="stat-item">
                    <div class="stat-val">
                        <?php 
                        $karyaWeb = array_filter($products, function($p) { return $p['category_name'] === 'free-web'; });
                        echo count($karyaWeb);
                        ?>
                    </div>
                    <div class="stat-lbl">Karya Web</div>
                </div>
                <div class="stat-item">
                    <div class="stat-val">
                        <?php 
                        $temps = array_filter($products, function($p) { return $p['category_name'] === 'templates'; });
                        echo count($temps);
                        ?>
                    </div>
                    <div class="stat-lbl">Templates</div>
                </div>
                <div class="stat-item">
                    <div class="stat-val">
                        <?php 
                        $presets = array_filter($products, function($p) { return $p['category_name'] === 'presets'; });
                        echo count($presets);
                        ?>
                    </div>
                    <div class="stat-lbl">Presets</div>
                </div>
            </div>

            <div class="dashboard-grid">
                <!-- Left: Catalog List & Integrations Guide -->
                <div>
                    <!-- Special Coffee Treat Settings Card -->
                    <?php if ($coffeeProduct): ?>
                        <div class="dashboard-card" style="border-left: 4px solid #d97706; background: rgba(217, 119, 6, 0.03);">
                            <div class="card-header" style="border-bottom-color: rgba(217, 119, 6, 0.15); margin-bottom: 20px; padding-bottom: 12px;">
                                <h3 class="card-title" style="color: #f59e0b;"><i data-lucide="coffee"></i> Pengaturan Donasi Traktir Kopi</h3>
                                <span class="tbl-badge" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.25);">Produk Donasi / Sistem</span>
                            </div>
                            <div style="display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap;">
                                <div style="flex-grow: 1; min-width: 250px;">
                                    <h4 style="color: #fff; font-size: 1rem; margin-bottom: 6px; font-weight: 700;"><?php echo htmlspecialchars($coffeeProduct['title_id']); ?> / <?php echo htmlspecialchars($coffeeProduct['title_en']); ?></h4>
                                    <p style="font-size: 0.85rem; color: var(--muted-text); line-height: 1.5; margin-bottom: 12px;"><?php echo htmlspecialchars($coffeeProduct['desc_id']); ?></p>
                                    <div style="display: flex; gap: 20px; font-size: 0.8rem; color: var(--muted-text); flex-wrap: wrap;">
                                        <span><strong>Harga:</strong> <span style="color: #fff; font-weight: 600;"><?php echo htmlspecialchars($coffeeProduct['price_string']); ?></span></span>
                                        <span><strong>Ikon:</strong> <code style="color: #f59e0b;"><?php echo htmlspecialchars($coffeeProduct['icon_name']); ?></code></span>
                                        <span><strong>Link DOKU:</strong> <a href="<?php echo htmlspecialchars($coffeeProduct['payment_link']); ?>" target="_blank" style="color: #f59e0b; text-decoration: none; border-bottom: 1px dotted #f59e0b;"><?php echo htmlspecialchars($coffeeProduct['payment_link']); ?></a></span>
                                    </div>
                                </div>
                                <div style="flex-shrink: 0;">
                                    <button class="btn-primary" onclick="editProduct(<?php echo htmlspecialchars(json_encode($coffeeProduct)); ?>)" style="background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); color: #fbbf24; padding: 10px 18px; border-radius: 4px; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 8px; cursor: pointer; width: auto; box-shadow: none;">
                                        <i data-lucide="edit-3" style="width:14px;height:14px;"></i> EDIT TRAKTIR KOPI
                                    </button>
                                </div>
                            </div>
                        </div>
                    <?php endif; ?>

                    <!-- Product Catalog List -->
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h3 class="card-title"><i data-lucide="package" style="color:var(--accent-color);"></i> Daftar Produk Jualan Aktif</h3>
                        </div>
                        <div class="product-table-wrapper">
                            <?php if (empty($products)): ?>
                                <p style="color: var(--muted-text); text-align: center; padding: 20px;">Belum ada produk. Silakan tambahkan menggunakan form di sebelah kanan.</p>
                            <?php else: ?>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Produk</th>
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
                                                        <div class="tbl-product-icon" style="overflow:hidden; border-radius:6px; background:#111; width:40px; height:40px;">
                                                            <?php if (!empty($prod['image_url'])): ?>
                                                                <img src="<?php echo htmlspecialchars($prod['image_url']); ?>" alt="Thumb" style="width:100%;height:100%;object-fit:cover;">
                                                            <?php else: ?>
                                                                <i data-lucide="<?php echo htmlspecialchars($prod['icon_name']); ?>" style="width:18px;height:18px;"></i>
                                                            <?php endif; ?>
                                                        </div>
                                                        <div>
                                                            <strong style="color:#fff;"><?php echo htmlspecialchars($prod['title_id']); ?></strong>
                                                            <div style="font-size:0.75rem;color:var(--muted-text);"><?php echo htmlspecialchars($prod['tags']); ?></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span class="tbl-badge"><?php echo htmlspecialchars($prod['category_name']); ?></span>
                                                </td>
                                                <td class="tbl-price"><?php echo htmlspecialchars($prod['price_string']); ?></td>
                                                <td>
                                                    <div class="action-cell">
                                                        <button class="btn-tbl-action" onclick="editProduct(<?php echo htmlspecialchars(json_encode($prod)); ?>)">
                                                            <i data-lucide="edit-2" style="width:14px;height:14px;"></i>
                                                        </button>
                                                        <a href="admin.php?action=delete&id=<?php echo $prod['id']; ?>" class="btn-tbl-action btn-del" onclick="return confirm('Apakah Anda yakin ingin menghapus produk ini?')">
                                                            <i data-lucide="trash-2" style="width:14px;height:14px;"></i>
                                                        </a>
                                                    </div>
                                                </td>
                                            </tr>
                                        <?php endforeach; ?>
                                    </tbody>
                                </table>
                            <?php endif; ?>
                        </div>
                    </div>

                    <!-- Integration Instructions widget -->
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h3 class="card-title"><i data-lucide="help-circle" style="color:var(--accent-color);"></i> Panduan Integrasi DOKU</h3>
                        </div>
                        <div class="instruction-box">
                            <h4><i data-lucide="link" style="width:16px;height:16px;"></i> Success Redirect URL</h4>
                            <p>Saat Anda membuat **Payment Link** atau **Multiple Payment** baru di dashboard DOKU Merchant, atur kolom **Redirect URL** / **Callback URL** agar pembeli otomatis kembali ke website Anda saat transaksi lunas:</p>
                            <div class="code-snippet-box">
                                <span id="success-url">https://zeifurrohman.com/shop.html?status=success</span>
                                <button class="btn-copy" onclick="copyText('success-url')">Salin URL</button>
                            </div>
                        </div>
                        <div class="instruction-box" style="margin-bottom:0; background:rgba(255,255,255,0.01); border-left-color:var(--muted-text);">
                            <h4><i data-lucide="check-circle-2" style="width:16px;height:16px;"></i> Cara Integrasi Produk Baru</h4>
                            <p style="margin-bottom:8px;">1. Masuk ke dashboard merchant DOKU Anda, lalu buat link pembayaran untuk produk baru Anda.</p>
                            <p style="margin-bottom:8px;">2. Isi data produk baru tersebut pada form **Kelola Produk** di dashboard ini.</p>
                            <p>3. Tempelkan link pembayaran DOKU tersebut ke input **DOKU Payment Link** di samping dan simpan. Produk akan langsung tayang secara otomatis!</p>
                        </div>
                    </div>
                </div>

                <!-- Right: CRUD Form Card -->
                <div>
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h3 class="card-title" id="form-card-title"><i data-lucide="plus-circle" style="color:var(--accent-color);"></i> Tambah Produk Baru</h3>
                        </div>
                        <form method="POST" action="admin.php" id="crud-product-form" enctype="multipart/form-data">
                            <input type="hidden" name="action" id="form-action" value="add">
                            <input type="hidden" name="id" id="form-product-id" value="">

                            <!-- Indonesian Title -->
                            <div class="form-group">
                                <label for="title_id">Nama Produk (Bahasa Indonesia)</label>
                                <input type="text" id="title_id" name="title_id" class="form-input" required placeholder="Contoh: Template Website Personal">
                            </div>

                            <!-- English Title -->
                            <div class="form-group">
                                <label for="title_en">Nama Produk (Bahasa Inggris)</label>
                                <input type="text" id="title_en" name="title_en" class="form-input" required placeholder="Contoh: Personal Website Template">
                            </div>

                            <!-- Indonesian Description -->
                            <div class="form-group">
                                <label for="desc_id">Deskripsi Produk (Bahasa Indonesia)</label>
                                <textarea id="desc_id" name="desc_id" class="form-input" required placeholder="Tuliskan deskripsi lengkap dalam Bahasa Indonesia..."></textarea>
                            </div>

                            <!-- English Description -->
                            <div class="form-group">
                                <label for="desc_en">Deskripsi Produk (Bahasa Inggris)</label>
                                <textarea id="desc_en" name="desc_en" class="form-input" required placeholder="Tuliskan deskripsi lengkap dalam Bahasa Inggris..."></textarea>
                            </div>

                            <!-- Features ID (Separated by |) -->
                            <div class="form-group">
                                <label for="features_id">Fitur Utama (Bahasa Indonesia, Pisahkan dengan tanda "|")</label>
                                <input type="text" id="features_id" name="features_id" class="form-input" placeholder="Desain Sinematik | Navigasi Sidebar | SEO Ramah">
                            </div>

                            <!-- Features EN (Separated by |) -->
                            <div class="form-group">
                                <label for="features_en">Fitur Utama (Bahasa Inggris, Pisahkan dengan tanda "|")</label>
                                <input type="text" id="features_en" name="features_en" class="form-input" placeholder="Cinematic Layout | Sidebar Nav | SEO Friendly">
                            </div>

                            <div class="form-grid-2">
                                <!-- Price Numeric -->
                                <div class="form-group">
                                    <label for="price">Harga (Rupiah, Tanpa Titik/Koma)</label>
                                    <input type="number" id="price" name="price" class="form-input" required placeholder="10000">
                                </div>

                                <!-- Category Selection -->
                                <div class="form-group">
                                    <label for="category_name">Kategori Item</label>
                                    <select id="category_name" name="category_name" class="form-input" style="background:#000;">
                                        <option value="free-web">KARYA WEB (WEB APP / DEMO GRATIS)</option>
                                        <option value="templates">TEMPLATE WEB</option>
                                        <option value="branding">ASET BRANDING</option>
                                        <option value="presets">PRESET & UI KIT</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-grid-2">
                                <!-- Icon Lucide name -->
                                <div class="form-group">
                                    <label for="icon_name">Nama Ikon Lucide</label>
                                    <select id="icon_name" name="icon_name" class="form-input" style="background:#000;">
                                        <option value="globe">globe (Web / Global)</option>
                                        <option value="external-link">external-link (Tautan Demo)</option>
                                        <option value="code-2">code-2 (Kode Program)</option>
                                        <option value="layout">layout (Tampilan Layout)</option>
                                        <option value="monitor">monitor (Layar Desktop)</option>
                                        <option value="smartphone">smartphone (Mobile App)</option>
                                        <option value="sparkles">sparkles (Fitur Inovatif)</option>
                                        <option value="coffee">coffee (Kopi / Donasi)</option>
                                        <option value="sliders">sliders (Presets)</option>
                                        <option value="figma">figma (Design Asset)</option>
                                        <option value="shield-check">shield-check (Tameng Sukses)</option>
                                    </select>
                                </div>

                                <!-- Custom CSS Preview Card Class -->
                                <div class="form-group">
                                    <label for="class_name">Gaya Warna Preview</label>
                                    <select id="class_name" name="class_name" class="form-input" style="background:#000;">
                                        <option value="preview-template-1">Warna Merah (Indo Red)</option>
                                        <option value="preview-template-2">Warna Hitam (Signature Dark)</option>
                                        <option value="preview-presets">Warna Abu (Warm Gray)</option>
                                        <option value="preview-branding">Warna Ungu (Purple Accent)</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Product tags -->
                            <div class="form-group">
                                <label for="tags">Tags / Label (Pisahkan dengan Koma)</label>
                                <input type="text" id="tags" name="tags" class="form-input" placeholder="CapKarya,WebApp,Monogram,React">
                            </div>

                            <!-- Product Image Upload & URL -->
                            <div class="form-group" style="background: rgba(0,0,0,0.35); border: 1px dashed var(--border-color); padding: 18px; border-radius: 0 0 14px 0; margin-bottom: 25px;">
                                <label style="color:#fff; font-weight:700; display:flex; align-items:center; gap:8px; margin-bottom:12px;">
                                    <i data-lucide="image" style="width:16px;height:16px;color:var(--accent-color);"></i> Gambar Display Produk / Screenshot Website Karya
                                </label>
                                <div style="display:flex; gap:16px; align-items:center; flex-wrap:wrap;">
                                    <div id="image-preview-container" style="width:80px; height:80px; background:rgba(0,0,0,0.6); border:1px solid var(--border-color); border-radius:10px; display:flex; justify-content:center; align-items:center; overflow:hidden; flex-shrink:0; position:relative;">
                                        <img id="img-preview" src="" alt="Preview" style="width:100%; height:100%; object-fit:cover; display:none;">
                                        <div id="img-placeholder-box" style="text-align:center;">
                                            <i data-lucide="image" style="width:24px; height:24px; color:var(--muted-text);"></i>
                                            <div style="font-size:0.65rem; color:var(--muted-text); margin-top:2px;">No Image</div>
                                        </div>
                                    </div>
                                    <div style="flex-grow:1; min-width:200px;">
                                        <label for="product_image" style="font-size:0.78rem; color:var(--text-main); font-weight:500;">Upload File Gambar / Screenshot Baru</label>
                                        <input type="file" id="product_image" name="product_image" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" class="form-input" style="padding:8px 12px; font-size:0.8rem; margin-top:4px;" onchange="previewSelectedImage(this)">
                                        <div style="font-size:0.7rem; color:var(--muted-text); margin-top:3px;">Format: JPG, PNG, WEBP, SVG (Otomatis disimpan di server)</div>

                                        <label for="image_url_text" style="font-size:0.78rem; color:var(--text-main); font-weight:500; margin-top:12px; display:block;">Atau URL / Path Asset Gambar</label>
                                        <input type="text" id="image_url_text" name="image_url_text" class="form-input" placeholder="Contoh: assets/images/capkarya-display-1.png" style="margin-top:4px;" oninput="previewUrlImage(this.value)">
                                    </div>
                                </div>
                            </div>

                            <!-- Link URL / DOKU Payment URL -->
                            <div class="form-group" style="margin-bottom: 30px;">
                                <label for="payment_link" style="color:#ff6b6b;font-weight:700;">Link URL Website / Demo Karya ATAU Link DOKU Payment</label>
                                <input type="url" id="payment_link" name="payment_link" class="form-input" required placeholder="Contoh: http://capkarya.great-site.net atau https://pay.doku.com/p-link/p/...">
                                <div style="font-size:0.72rem; color:var(--muted-text); margin-top:4px;">* Untuk Karya Web, isi dengan URL website karya Anda (misal: <code>http://capkarya.great-site.net</code>). Untuk produk jualan, isi link DOKU Payment.</div>
                            </div>

                            <div style="display:flex;gap:15px;">
                                <button type="submit" class="btn-primary" style="flex-grow:1;" id="btn-submit-form">
                                    <i data-lucide="save" style="width:16px;height:16px;"></i> SIMPAN PRODUK
                                </button>
                                <button type="button" class="btn-logout" style="display:none;" id="btn-cancel-edit" onclick="resetForm()">
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        <?php endif; ?>
    </div>

    <script>
        lucide.createIcons();

        // Update Success URL to current hostname dynamically
        document.addEventListener('DOMContentLoaded', () => {
            const successEl = document.getElementById('success-url');
            if (successEl) {
                const domain = window.location.origin + window.location.pathname.replace('admin.php', 'shop.html?status=success');
                successEl.textContent = domain;
            }
        });

        function updateImagePreview(src) {
            const imgPreview = document.getElementById('img-preview');
            const placeholderBox = document.getElementById('img-placeholder-box');
            if (src && src.trim() !== '') {
                imgPreview.src = src;
                imgPreview.style.display = 'block';
                if (placeholderBox) placeholderBox.style.display = 'none';
            } else {
                imgPreview.src = '';
                imgPreview.style.display = 'none';
                if (placeholderBox) placeholderBox.style.display = 'block';
            }
        }

        function previewSelectedImage(input) {
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    updateImagePreview(e.target.result);
                };
                reader.readAsDataURL(input.files[0]);
            }
        }

        function previewUrlImage(url) {
            if (url && url.trim() !== '') {
                updateImagePreview(url);
            } else {
                const fileInput = document.getElementById('product_image');
                if (fileInput && fileInput.files && fileInput.files[0]) {
                    previewSelectedImage(fileInput);
                } else {
                    updateImagePreview('');
                }
            }
        }

        // Edit mode configuration
        function editProduct(product) {
            document.getElementById('form-card-title').innerHTML = '<i data-lucide="edit-3" style="color:var(--accent-color);"></i> Edit Produk: ' + product.title_id;
            document.getElementById('form-action').value = 'edit';
            document.getElementById('form-product-id').value = product.id;
            
            document.getElementById('title_id').value = product.title_id;
            document.getElementById('title_en').value = product.title_en;
            document.getElementById('desc_id').value = product.desc_id;
            document.getElementById('desc_en').value = product.desc_en;
            
            // Re-join pipe separated lists for text inputs
            document.getElementById('features_id').value = product.features_id ? product.features_id.replace(/ \| /g, ' | ') : '';
            document.getElementById('features_en').value = product.features_en ? product.features_en.replace(/ \| /g, ' | ') : '';
            
            document.getElementById('price').value = parseInt(product.price);
            document.getElementById('category_name').value = product.category_name;
            document.getElementById('icon_name').value = product.icon_name;
            document.getElementById('class_name').value = product.class_name;
            document.getElementById('tags').value = product.tags;
            document.getElementById('payment_link').value = product.payment_link;
            
            const imageUrl = product.image_url || '';
            document.getElementById('image_url_text').value = imageUrl;
            document.getElementById('product_image').value = '';
            updateImagePreview(imageUrl);
            
            document.getElementById('btn-submit-form').innerHTML = '<i data-lucide="refresh-cw" style="width:16px;height:16px;"></i> UPDATE PRODUK';
            document.getElementById('btn-cancel-edit').style.display = 'block';
            
            lucide.createIcons();
            window.scrollTo({ top: document.getElementById('crud-product-form').offsetTop - 50, behavior: 'smooth' });
        }

        function resetForm() {
            document.getElementById('form-card-title').innerHTML = '<i data-lucide="plus-circle" style="color:var(--accent-color);"></i> Tambah Produk Baru';
            document.getElementById('form-action').value = 'add';
            document.getElementById('form-product-id').value = '';
            document.getElementById('crud-product-form').reset();
            updateImagePreview('');
            
            document.getElementById('btn-submit-form').innerHTML = '<i data-lucide="save" style="width:16px;height:16px;"></i> SIMPAN PRODUK';
            document.getElementById('btn-cancel-edit').style.display = 'none';
            
            lucide.createIcons();
        }

        // Copy Text Helper
        function copyText(id) {
            const text = document.getElementById(id).textContent;
            navigator.clipboard.writeText(text).then(() => {
                alert('Tautan sukses berhasil disalin ke clipboard!');
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        }
    </script>
</body>
</html>
