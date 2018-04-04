<?php
include_once dirname(__DIR__) . '/autoload.php';
$database = new Database();
$db = $database->getConnection();
$search = new Search($db);
$data = json_decode(file_get_contents("php://input"));
$search->idUser = $data->idUser;
$stmt = $search->contadorByCompany();
$num = $stmt->rowCount();
$data = "";
if ($num > 0) {
	$rowx = [];
	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		array_push($rowx, $row);
	}
	$data = json_encode($rowx);
  if (count($data) == 0) {
    $data .= '{';
		$data .= '"contador": ' . 0 ;
		$data .= '}';
  }
}
echo '{"records":' . $data . '}';
