<?php
ini_set('display_errors', 1);

include_once 'conexao.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['nome']) && isset($_POST['tentativas'])) {
        $nome = trim($_POST['nome']);
        $tentativas = trim($_POST['tentativas']);
        
        if ($stmt = $conn->prepare("INSERT INTO resultados_binarios (nome, tentativas) VALUES (?, ?)")) {
            $stmt->bind_param("si", $nome, $tentativas);
            
            if ($stmt->execute()) {
                echo "Dados inseridos com sucesso!";
            } else {
                echo "Erro ao inserir dados: " . $stmt->error;
            }
            
            $stmt->close();
        } else {
            echo "Erro na preparação da consulta: " . $conn->error;
        }
    } else {
        echo "Campos 'nome' e 'tentativas' não foram recebidos.";
    }
} else {
    echo "O formulário não foi submetido.";
}

$conn->close();
?>
