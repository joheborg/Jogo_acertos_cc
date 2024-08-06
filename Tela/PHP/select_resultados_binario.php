<?php
ini_set('display_errors', 1);
include_once 'conexao.php';

$sql = "SELECT 
    ROW_NUMBER() OVER (ORDER BY tentativas ASC, dt_registro asc) AS ranking,
    id, 
    dt_registro, 
    nome, 
    tentativas
FROM 
    trabalho_faculdade.resultados_binarios
where
  tentativas not null
ORDER BY 
    tentativas ASC, dt_registro asc
LIMIT 10;
";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
  $dados = array();
  while ($row = $result->fetch_assoc()) {
    $dados[] = $row;
  }
  echo json_encode($dados);
} else {
  echo json_encode(array());
}
$conn->close();
