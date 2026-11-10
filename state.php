<?php

header("Content-Type: application/json; charset=utf-8");
session_start();

function respond($status, $payload)
{
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

if (empty($_SESSION["user_id"])) {
    respond(401, ["success" => false, "message" => "Please sign in again."]);
}

$transactionStarted = false;

try {
    require "db.php";

    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        $result = $conn->query("SELECT payload, version FROM app_state WHERE id = 1");
        $row = $result->fetch_assoc();
        $state = $row ? json_decode($row["payload"], true) : null;

        if ($row && !is_array($state)) {
            respond(500, ["success" => false, "message" => "Saved application data is invalid."]);
        }
        if (is_array($state)) {
            $state["recipes"] = (object)($state["recipes"] ?? []);
        }

        respond(200, [
            "success" => true,
            "state" => $state,
            "version" => $row ? (int)$row["version"] : 0
        ]);
    }

    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        header("Allow: GET, POST");
        respond(405, ["success" => false, "message" => "Method not allowed."]);
    }

    $state = json_decode(file_get_contents("php://input"), true);
    if (!is_array($state) ||
        !isset($state["products"], $state["materials"], $state["sales"], $state["recipes"], $state["archivedProducts"]) ||
        !is_array($state["products"]) ||
        !is_array($state["materials"]) ||
        !is_array($state["sales"]) ||
        !is_array($state["recipes"]) ||
        !is_array($state["archivedProducts"]) ||
        !isset($state["version"]) ||
        !is_int($state["version"]) ||
        $state["version"] < 0) {
        respond(422, ["success" => false, "message" => "Application data is missing required fields."]);
    }

    foreach ($state["products"] as $product) {
        if (!is_array($product) ||
            !isset($product["id"], $product["name"], $product["category"], $product["price"]) ||
            !is_numeric($product["price"]) ||
            !is_finite((float)$product["price"]) ||
            (float)$product["price"] < 0 ||
            strlen((string)$product["id"]) > 100 ||
            strlen((string)$product["name"]) > 150 ||
            strlen((string)$product["category"]) > 100) {
            respond(422, ["success" => false, "message" => "A menu item has invalid or missing fields."]);
        }
    }

    foreach ($state["materials"] as $material) {
        if (!is_array($material) ||
            !isset($material["id"], $material["name"], $material["stock"], $material["threshold"]) ||
            !is_numeric($material["stock"]) ||
            !is_numeric($material["threshold"]) ||
            !is_finite((float)$material["stock"]) ||
            !is_finite((float)$material["threshold"]) ||
            strlen((string)$material["id"]) > 100 ||
            strlen((string)$material["name"]) > 100) {
            respond(422, ["success" => false, "message" => "A material has invalid or missing fields."]);
        }
        $expiresOn = (string)($material["expiresOn"] ?? "");
        if ($expiresOn !== "" && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $expiresOn)) {
            respond(422, ["success" => false, "message" => "A material has an invalid expiry date."]);
        }
    }

    foreach ($state["sales"] as $sale) {
        if (!is_array($sale) ||
            !isset($sale["id"], $sale["total"], $sale["items"]) ||
            !is_numeric($sale["total"]) ||
            !is_finite((float)$sale["total"]) ||
            !is_array($sale["items"]) ||
            strlen((string)$sale["id"]) > 50 ||
            strlen((string)($sale["cashier"] ?? "Staff")) > 100 ||
            strlen((string)($sale["payment"] ?? "")) > 50) {
            respond(422, ["success" => false, "message" => "A sale has invalid or missing fields."]);
        }

        $saleDate = (string)($sale["createdAt"] ?? "");
        if ($saleDate === "") {
            respond(422, ["success" => false, "message" => "A sale has an invalid date."]);
        }

        try {
            new DateTimeImmutable($saleDate);
        } catch (Throwable $error) {
            respond(422, ["success" => false, "message" => "A sale has an invalid date."]);
        }

        foreach ($sale["items"] as $item) {
            if (!is_array($item) ||
                !isset($item["id"], $item["name"], $item["quantity"], $item["price"]) ||
                !is_numeric($item["quantity"]) ||
                !is_numeric($item["price"]) ||
                (int)$item["quantity"] < 1 ||
                (float)$item["price"] < 0 ||
                strlen((string)$item["id"]) > 100 ||
                strlen((string)$item["name"]) > 150) {
                respond(422, ["success" => false, "message" => "A sale item has invalid or missing fields."]);
            }
        }
    }

    foreach ($state["recipes"] as $productId => $recipe) {
        if (strlen((string)$productId) > 100 || !is_array($recipe)) {
            respond(422, ["success" => false, "message" => "A menu recipe has invalid or missing fields."]);
        }
        foreach ($recipe as $ingredient) {
            if (!is_array($ingredient) ||
                !isset($ingredient["materialId"], $ingredient["quantity"]) ||
                !is_numeric($ingredient["quantity"]) ||
                !is_finite((float)$ingredient["quantity"]) ||
                (float)$ingredient["quantity"] <= 0 ||
                strlen((string)$ingredient["materialId"]) > 100) {
                respond(422, ["success" => false, "message" => "A recipe ingredient has invalid or missing fields."]);
            }
        }
    }

    foreach ($state["archivedProducts"] as $product) {
        if (!is_array($product) ||
            !isset($product["id"]) ||
            strlen((string)$product["id"]) > 100 ||
            !isset($product["archivedAt"])) {
            respond(422, ["success" => false, "message" => "An archived menu item has invalid or missing fields."]);
        }
        try {
            new DateTimeImmutable((string)$product["archivedAt"]);
        } catch (Throwable $error) {
            respond(422, ["success" => false, "message" => "An archived menu item has an invalid date."]);
        }
    }

    $expectedVersion = $state["version"];
    $state["recipes"] = (object)$state["recipes"];
    unset($state["version"]);
    $payload = json_encode($state);
    if ($payload === false || strlen($payload) > 5000000) {
        respond(413, ["success" => false, "message" => "Application data is too large to save."]);
    }

    $conn->begin_transaction();
    $transactionStarted = true;

    $versionResult = $conn->query("SELECT version FROM app_state WHERE id = 1 FOR UPDATE");
    $versionRow = $versionResult->fetch_assoc();
    $currentVersion = $versionRow ? (int)$versionRow["version"] : 0;
    if ($expectedVersion !== $currentVersion) {
        $conn->rollback();
        $transactionStarted = false;
        respond(409, [
            "success" => false,
            "message" => "Shop data changed in another session. Refresh to load the latest data before saving.",
            "version" => $currentVersion
        ]);
    }
    $nextVersion = $currentVersion + 1;

    $statement = $conn->prepare(
        "INSERT INTO app_state (id, payload, version) VALUES (1, ?, ?)
         ON DUPLICATE KEY UPDATE payload = VALUES(payload), version = VALUES(version)"
    );
    $statement->bind_param("si", $payload, $nextVersion);
    $statement->execute();

    $conn->query("DELETE FROM sale_items");
    $conn->query("DELETE FROM sales");
    $conn->query("DELETE FROM recipes");
    $conn->query("DELETE FROM products");
    $conn->query("DELETE FROM archived_products");
    $conn->query("DELETE FROM materials");

    $materialStatement = $conn->prepare(
        "INSERT INTO materials
         (id, name, stock, threshold, category, supplier, brand, unit, expires_on, setup_required, groups_json)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    foreach ($state["materials"] as $material) {
        $id = (string)$material["id"];
        $name = (string)$material["name"];
        $stock = (float)$material["stock"];
        $threshold = (float)$material["threshold"];
        $category = (string)($material["category"] ?? "");
        $supplier = (string)($material["supplier"] ?? "");
        $brand = (string)($material["brand"] ?? "");
        $unit = (string)($material["unit"] ?? "piece");
        $expiresOn = (string)($material["expiresOn"] ?? "");
        $expiresOn = $expiresOn === "" ? null : $expiresOn;
        $setupRequired = !empty($material["setupRequired"]) ? 1 : 0;
        $groups = json_encode($material["groups"] ?? []);
        $materialStatement->bind_param(
            "ssddsssssis",
            $id,
            $name,
            $stock,
            $threshold,
            $category,
            $supplier,
            $brand,
            $unit,
            $expiresOn,
            $setupRequired,
            $groups
        );
        $materialStatement->execute();
    }

    $productStatement = $conn->prepare(
        "INSERT INTO products (id, name, category, price, glyph) VALUES (?, ?, ?, ?, ?)"
    );
    foreach ($state["products"] as $product) {
        $id = (string)$product["id"];
        $name = (string)$product["name"];
        $category = (string)$product["category"];
        $price = (float)$product["price"];
        $glyph = (string)($product["glyph"] ?? "◉");
        $productStatement->bind_param("sssds", $id, $name, $category, $price, $glyph);
        $productStatement->execute();
    }

    $recipeStatement = $conn->prepare(
        "INSERT INTO recipes (product_id, material_id, quantity) VALUES (?, ?, ?)"
    );
    foreach ($state["recipes"] as $productId => $recipe) {
        foreach ($recipe as $ingredient) {
            $materialId = (string)$ingredient["materialId"];
            $quantity = (float)$ingredient["quantity"];
            $recipeStatement->bind_param("ssd", $productId, $materialId, $quantity);
            $recipeStatement->execute();
        }
    }

    $archiveStatement = $conn->prepare(
        "INSERT INTO archived_products (id, payload, archived_at) VALUES (?, ?, ?)"
    );
    foreach ($state["archivedProducts"] as $product) {
        $id = (string)$product["id"];
        $archivePayload = json_encode($product);
        $archivedAt = (new DateTimeImmutable((string)$product["archivedAt"]))->format("Y-m-d H:i:s");
        $archiveStatement->bind_param("sss", $id, $archivePayload, $archivedAt);
        $archiveStatement->execute();
    }

    $saleStatement = $conn->prepare(
        "INSERT INTO sales (sale_id, cashier, payment_method, total, created_at)
         VALUES (?, ?, ?, ?, ?)"
    );
    $itemStatement = $conn->prepare(
        "INSERT INTO sale_items (sale_id, product_id, product_name, quantity, price)
         VALUES (?, ?, ?, ?, ?)"
    );
    foreach ($state["sales"] as $sale) {
        $saleId = (string)$sale["id"];
        $cashier = (string)($sale["cashier"] ?? "Staff");
        $payment = (string)($sale["payment"] ?? "");
        $total = (float)$sale["total"];
        $createdAt = (new DateTimeImmutable((string)$sale["createdAt"]))->format("Y-m-d H:i:s");
        $saleStatement->bind_param("sssds", $saleId, $cashier, $payment, $total, $createdAt);
        $saleStatement->execute();

        foreach ($sale["items"] as $item) {
            $productId = (string)$item["id"];
            $productName = (string)$item["name"];
            $quantity = (int)$item["quantity"];
            $price = (float)$item["price"];
            $itemStatement->bind_param("sssid", $saleId, $productId, $productName, $quantity, $price);
            $itemStatement->execute();
        }
    }

    $conn->commit();
    $transactionStarted = false;
    respond(200, ["success" => true, "version" => $nextVersion]);
} catch (Throwable $error) {
    if ($transactionStarted) {
        try {
            $conn->rollback();
        } catch (Throwable $rollbackError) {
            error_log($rollbackError->getMessage());
        }
    }
    error_log($error->getMessage());
    respond(500, ["success" => false, "message" => "The server could not save application data."]);
}
