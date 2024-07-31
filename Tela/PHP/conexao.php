<?php
$config_file = 'config.json';
$config_data = file_get_contents($config_file);

$config = json_decode($config_data, true);

$ip = $config['ip'];
$user = $config['user'];
$password = $config['password'];
$database = $config['database'];

$conn = new mysqli($ip, $user, $password, $database);
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}