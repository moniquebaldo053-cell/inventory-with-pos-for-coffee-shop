<?php

header("Content-Type: application/json; charset=utf-8");

function respond($status, $payload)
{
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

try {
    require "db.php";

    $fullname = trim((string)($_POST["fullname"] ?? ""));
    $email = strtolower(trim((string)($_POST["email"] ?? "")));
    $password = (string)($_POST["password"] ?? "");

    if ($fullname === "" || strlen($fullname) > 120 ||
        !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254 ||
        strlen($password) < 8 || strlen($password) > 200) {
        respond(422, ["success" => false, "message" => "Provide a name, valid email, and password of at least 8 characters."]);
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);
    $statement = $conn->prepare(
        "INSERT INTO users (fullname, email, password, role) VALUES (?, ?, ?, 'staff')"
    );
    $statement->bind_param("sss", $fullname, $email, $hash);
    $statement->execute();

    respond(201, ["success" => true, "message" => "Account created successfully."]);
} catch (mysqli_sql_exception $error) {
    if ((int)$error->getCode() === 1062) {
        respond(409, ["success" => false, "message" => "An account with this email already exists."]);
    }
    error_log($error->getMessage());
    respond(500, ["success" => false, "message" => "The server could not save your account."]);
} catch (Throwable $error) {
    error_log($error->getMessage());
    respond(500, ["success" => false, "message" => "The server could not connect to the database."]);
}
