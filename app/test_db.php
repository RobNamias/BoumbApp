<?php
$dsn = "pgsql:host=boumbapp_database;port=5432;dbname=boumbappdb;";
$user = "JeanTreu";
$password = "secret";

echo "Testing connection to $dsn with user $user...\n";

try {
    $pdo = new PDO($dsn, $user, $password, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    echo "Connected successfully to PostgreSQL!\n";
    
    $stmt = $pdo->query("SELECT 1");
    echo "Query Result: " . $stmt->fetchColumn() . "\n";
    
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
    print_r(PDO::getAvailableDrivers());
}
