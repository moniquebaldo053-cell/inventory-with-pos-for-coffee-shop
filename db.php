<?php

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$dbHost = "localhost";
$dbUser = "root";
$dbPassword = "";
$dbName = "brewpoint_db";

$conn = new mysqli($dbHost, $dbUser, $dbPassword);
$conn->set_charset("utf8mb4");
$conn->query(
    "CREATE DATABASE IF NOT EXISTS `$dbName` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
);
$conn->select_db($dbName);

$conn->query(
    "CREATE TABLE IF NOT EXISTS users (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        fullname VARCHAR(120) NOT NULL,
        email VARCHAR(254) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('staff', 'admin') NOT NULL DEFAULT 'staff',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
);

$userColumns = [];
$userColumnResult = $conn->query("SHOW COLUMNS FROM users");
while ($column = $userColumnResult->fetch_assoc()) {
    $userColumns[$column["Field"]] = $column["Type"];
}
if (isset($userColumns["fullname"]) && $userColumns["fullname"] !== "varchar(120)") {
    $conn->query("ALTER TABLE users MODIFY fullname VARCHAR(120) NULL");
}
if (isset($userColumns["email"]) && $userColumns["email"] !== "varchar(254)") {
    $conn->query("ALTER TABLE users MODIFY email VARCHAR(254) NULL");
}
$emailIndexExists = false;
$indexResult = $conn->query("SHOW INDEX FROM users");
while ($index = $indexResult->fetch_assoc()) {
    if ($index["Column_name"] === "email" && (int)$index["Non_unique"] === 0) {
        $emailIndexExists = true;
        break;
    }
}
if (!$emailIndexExists) {
    $duplicateEmails = $conn->query(
        "SELECT COUNT(*) AS count FROM (
            SELECT email FROM users WHERE email IS NOT NULL
            GROUP BY email HAVING COUNT(*) > 1
        ) duplicates"
    )->fetch_assoc();
    if ((int)$duplicateEmails["count"] === 0) {
        $conn->query("ALTER TABLE users ADD UNIQUE KEY uq_users_email (email)");
    }
}

$conn->query(
    "CREATE TABLE IF NOT EXISTS app_state (
        id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
        payload LONGTEXT NOT NULL,
        version BIGINT UNSIGNED NOT NULL DEFAULT 1,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
);

$appStateColumns = $conn->query("SHOW COLUMNS FROM app_state");
$hasVersion = false;
while ($column = $appStateColumns->fetch_assoc()) {
    if ($column["Field"] === "version") {
        $hasVersion = true;
        break;
    }
}
if (!$hasVersion) {
    $conn->query("ALTER TABLE app_state ADD COLUMN version BIGINT UNSIGNED NOT NULL DEFAULT 1");
}

$conn->query(
    "CREATE TABLE IF NOT EXISTS materials (
        id VARCHAR(100) NOT NULL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        stock DECIMAL(12,4) NOT NULL DEFAULT 0,
        threshold DECIMAL(12,4) NOT NULL DEFAULT 0,
        category VARCHAR(100) NOT NULL DEFAULT '',
        supplier VARCHAR(100) NOT NULL DEFAULT '',
        brand VARCHAR(100) NOT NULL DEFAULT '',
        unit VARCHAR(30) NOT NULL DEFAULT 'piece',
        expires_on DATE NULL,
        setup_required TINYINT(1) NOT NULL DEFAULT 0,
        groups_json LONGTEXT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
);

$conn->query(
    "CREATE TABLE IF NOT EXISTS sales (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        sale_id VARCHAR(50) NOT NULL,
        cashier VARCHAR(100) NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        created_at DATETIME NOT NULL,
        INDEX (sale_id),
        INDEX (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
);

$conn->query(
    "CREATE TABLE IF NOT EXISTS sale_items (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        sale_id VARCHAR(50) NOT NULL,
        product_id VARCHAR(100) NOT NULL,
        product_name VARCHAR(150) NOT NULL,
        quantity INT UNSIGNED NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        INDEX (sale_id),
        INDEX (product_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
);

$conn->query(
    "CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(100) NOT NULL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        category VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        glyph VARCHAR(20) NOT NULL DEFAULT '◉'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
);

$conn->query(
    "CREATE TABLE IF NOT EXISTS recipes (
        product_id VARCHAR(100) NOT NULL,
        material_id VARCHAR(100) NOT NULL,
        quantity DECIMAL(12,4) NOT NULL,
        PRIMARY KEY (product_id, material_id),
        INDEX (material_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
);

$conn->query(
    "CREATE TABLE IF NOT EXISTS archived_products (
        id VARCHAR(100) NOT NULL PRIMARY KEY,
        payload LONGTEXT NOT NULL,
        archived_at DATETIME NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
);

$materialColumns = [];
$materialColumnResult = $conn->query("SHOW COLUMNS FROM materials");
while ($column = $materialColumnResult->fetch_assoc()) {
    $materialColumns[$column["Field"]] = true;
}
$materialMigrations = [
    "category" => "ALTER TABLE materials ADD COLUMN category VARCHAR(100) NOT NULL DEFAULT ''",
    "supplier" => "ALTER TABLE materials ADD COLUMN supplier VARCHAR(100) NOT NULL DEFAULT ''",
    "brand" => "ALTER TABLE materials ADD COLUMN brand VARCHAR(100) NOT NULL DEFAULT ''",
    "unit" => "ALTER TABLE materials ADD COLUMN unit VARCHAR(30) NOT NULL DEFAULT 'piece'",
    "expires_on" => "ALTER TABLE materials ADD COLUMN expires_on DATE NULL",
    "setup_required" => "ALTER TABLE materials ADD COLUMN setup_required TINYINT(1) NOT NULL DEFAULT 0",
    "groups_json" => "ALTER TABLE materials ADD COLUMN groups_json LONGTEXT NOT NULL"
];
foreach ($materialMigrations as $column => $migration) {
    if (!isset($materialColumns[$column])) {
        $conn->query($migration);
    }
}
$materialColumnResult = $conn->query("SHOW COLUMNS FROM materials");
while ($column = $materialColumnResult->fetch_assoc()) {
    if (in_array($column["Field"], ["stock", "threshold"], true) &&
        stripos($column["Type"], "decimal(10,2)") === 0) {
        $conn->query(
            "ALTER TABLE materials MODIFY `{$column["Field"]}` DECIMAL(12,4) NULL"
        );
    }
}
