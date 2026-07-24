<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'config.php';

$db = getDbConnection();

if (!$db) {
    echo json_encode([]);
    exit;
}

// Ensure blogs table exists
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

$result = $db->query("SELECT * FROM `blogs` ORDER BY `id` DESC");
$blogs = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $id = "post" . $row['id'];
        $tagsArray = array_filter(array_map('trim', explode(',', $row['tags'])));
        
        $blogs[$id] = [
            "id" => $id,
            "numeric_id" => intval($row['id']),
            "slug" => $row['slug'],
            "title_id" => $row['title_id'],
            "title_en" => $row['title_en'],
            "category" => $row['category'],
            "tags" => implode(',', $tagsArray),
            "author" => $row['author'],
            "date" => $row['created_date'],
            "excerpt_id" => $row['excerpt_id'],
            "excerpt_en" => $row['excerpt_en'],
            "content_id" => $row['content_id'],
            "content_en" => $row['content_en'],
            "image" => $row['image_url'] ?? ""
        ];
    }
    $result->free();
}

$db->close();

echo json_encode($blogs);
