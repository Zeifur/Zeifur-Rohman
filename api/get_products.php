<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'config.php';

$db = getDbConnection();

if (!$db) {
    // If database connection is offline, return an empty array.
    // The frontend will automatically detect this and load fallback mock data.
    echo json_encode([]);
    exit;
}

$result = $db->query("SELECT * FROM `products` ORDER BY `id` DESC");
$products = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $id = intval($row['id']);
        
        // Split comma-separated tags
        $tagsArray = array_map('trim', explode(',', $row['tags']));
        $tagsArray = array_filter($tagsArray);
        
        $products[$id] = [
            "id" => $id,
            "title_id" => $row['title_id'],
            "title_en" => $row['title_en'],
            "desc_id" => $row['desc_id'],
            "desc_en" => $row['desc_en'],
            "features_id" => $row['features_id'],
            "features_en" => $row['features_en'],
            "priceNumeric" => floatval($row['price']),
            "priceString" => $row['price_string'],
            "class" => $row['class_name'],
            "icon" => $row['icon_name'],
            "category" => $row['category_name'],
            "tags" => array_values($tagsArray),
            "paymentLink" => $row['payment_link'],
            "webLink" => $row['payment_link'],
            "image" => !empty($row['image_url']) ? $row['image_url'] : ""
        ];
    }
    $result->free();
}

$db->close();

echo json_encode($products);
