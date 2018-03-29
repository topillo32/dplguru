<?php
include_once dirname(__DIR__) . '/autoload.php';
$database = new Database();
$db = $database->getConnection();
$search = new Search($db);
$data = json_decode(file_get_contents("php://input"));
$search->idUser = $data->idUser;
$search->limit = $data->limit ?: 10;
$search->start = $data->page ? $search->limit * ($data->page-1)	 : 0;
$stmt = $search->readAllSearches();
$num = $stmt->rowCount();
$data = "";
if ($num > 0) {
	$rowx = [];
	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		array_push($rowx, $row);
	}
	$data = json_encode($rowx);
}
echo '{"records":' . $data . '}';
