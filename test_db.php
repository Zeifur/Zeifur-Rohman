<?php
// Diagnostic tool to check database connection on Hostinger
// Access this via: https://zeifurrohman.com/test_db.php

require_once 'api/config.php';

echo "<h3>MySQL Database Diagnostic</h3>";
echo "Host: " . DB_HOST . "<br>";
echo "User: " . DB_USER . "<br>";
echo "DB Name: " . DB_NAME . "<br><br>";

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    echo "<b style='color:red;'>Connection failed:</b> " . htmlspecialchars($conn->connect_error) . "<br>";
} else {
    echo "<b style='color:green;'>Connection successful!</b><br>";
    $res = $conn->query("SHOW TABLES LIKE 'products'");
    if ($res && $res->num_rows > 0) {
        echo "Table 'products' exists.<br>";
        $q = $conn->query("SELECT COUNT(*) as count FROM products");
        if ($q) {
            $row = $q->fetch_assoc();
            echo "Total products in database: <b>" . $row['count'] . "</b><br>";
        } else {
            echo "Error querying table: " . $conn->error . "<br>";
        }
    } else {
        echo "<b style='color:red;'>Table 'products' does not exist!</b> Please import database/schema_v3.sql in your phpMyAdmin.<br>";
    }
    $conn->close();
}
