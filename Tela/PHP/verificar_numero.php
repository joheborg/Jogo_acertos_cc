<?php
ini_set('display_errors', 0);

include_once 'conexao.php';

$response = array("success" => false, "message" => "", "resultado" => null);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $numero_binario = filter_input(INPUT_POST, 'numero_binario', FILTER_VALIDATE_INT);
    $numero = filter_input(INPUT_POST, 'numero', FILTER_VALIDATE_INT);
    $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);

    if ($numero_binario === false || $numero === false || $id === false) {
        $response["message"] = "Os valores devem ser números inteiros.";
    } else {
        $conn->autocommit(FALSE);

        try {
            if ($stmt = $conn->prepare("CALL VERIFICARNUMERORANDOM(?, ?, ?, @resultado);")) {
                $stmt->bind_param("iii", $numero_binario, $numero, $id);

                if ($stmt->execute()) {
                    $result = $conn->query("SELECT @resultado AS resultado");
                    $row = $result->fetch_assoc();

                    $response["success"] = true;
                    $response["message"] = "Número verificado com sucesso!";
                    $response["resultado"] = $row['resultado'];

                    $conn->commit();
                } else {
                    throw new Exception("Erro ao executar a consulta: " . $stmt->error);
                }

                $stmt->close();
            } else {
                throw new Exception("Erro na preparação da consulta: " . $conn->error);
            }
        } catch (Exception $e) {
            $conn->rollback();
            $response["message"] = $e->getMessage();
        }

        $conn->autocommit(TRUE);
    }
} else {
    $response["message"] = "O formulário não foi submetido.";
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($response, JSON_THROW_ON_ERROR);
?>