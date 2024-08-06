<?php
ini_set('display_errors', 0);

include_once 'conexao.php';

$response = array("success" => false, "message" => "", "resultado_id" => null);

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (isset($_POST['tipo']) && isset($_POST['nome'])) {
        $tipo = filter_var(trim($_POST['tipo']), FILTER_SANITIZE_STRING);
        $nome = filter_var(trim($_POST['nome']), FILTER_SANITIZE_STRING);

        $conn->autocommit(FALSE);

        try {
            if ($stmt = $conn->prepare("CALL trabalho_faculdade.GRAVARRESULTADO(?, ?, @resultado_id)")) {
                $stmt->bind_param("ss", $tipo, $nome);

                if ($stmt->execute()) {
                    $stmt->close();

                    $result = $conn->query("SELECT @resultado_id AS resultado_id");
                    $row = $result->fetch_assoc();

                    $response["success"] = true;
                    $response["message"] = "Dados inseridos com sucesso!";
                    $response["resultado_id"] = $row['resultado_id'];

                    $conn->commit();
                } else {
                    throw new Exception("Erro ao inserir dados: " . $stmt->error);
                }
            } else {
                throw new Exception("Erro na preparação da consulta: " . $conn->error);
            }
        } catch (Exception $e) {
            $conn->rollback();
            $response["message"] = $e->getMessage();
        }

        $conn->autocommit(TRUE);
    } else {
        $response["message"] = "Campos 'tipo' e 'nome' não foram recebidos.";
    }
} else {
    http_response_code(405);
    $response["message"] = "O formulário não foi submetido.";
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($response, JSON_THROW_ON_ERROR);
?>