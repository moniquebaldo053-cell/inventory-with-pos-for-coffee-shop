<?php

header("Content-Type: application/json; charset=utf-8");
session_start();

function respond($status, $payload)
{
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

try {
    require "db.php";

    $input = json_decode(file_get_contents("php://input"), true);
    $email = strtolower(trim((string)($input["email"] ?? "")));
    $password = (string)($input["password"] ?? "");
    $requestedRole = (string)($input["role"] ?? "");

    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === "" ||
        !in_array($requestedRole, ["staff", "admin"], true)) {
        respond(422, ["success" => false, "message" => "Enter a valid email, password, and account type."]);
    }

    $statement = $conn->prepare(
        "SELECT id, fullname, email, password, role FROM users WHERE email = ? LIMIT 1"
    );
    $statement->bind_param("s", $email);
    $statement->execute();
    $user = $statement->get_result()->fetch_assoc();

    if (!$user || !password_verify($password, $user["password"]) ||
        $user["role"] !== $requestedRole) {
        respond(401, ["success" => false, "message" => "Email, password, or account type is incorrect."]);
    }

    session_regenerate_id(true);
    $_SESSION["user_id"] = (int)$user["id"];
    $_SESSION["fullname"] = $user["fullname"];
    $_SESSION["role"] = $user["role"];

    $stateResult = $conn->query("SELECT payload, version FROM app_state WHERE id = 1");
    $stateRow = $stateResult->fetch_assoc();
    $state = $stateRow ? json_decode($stateRow["payload"], true) : null;
    if (is_array($state)) {
        $state["recipes"] = (object)($state["recipes"] ?? []);
    }

    respond(200, [
        "success" => true,
        "fullname" => $user["fullname"],
        "role" => $user["role"],
        "state" => $state,
        "version" => $stateRow ? (int)$stateRow["version"] : 0
    ]);
} catch (Throwable $error) {
    error_log($error->getMessage());
    respond(500, ["success" => false, "message" => "The server could not connect to the database."]);
}
