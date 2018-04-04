<?php
include_once dirname(__DIR__) . '/autoload.php';
$database = new Database();
$db = $database->getConnection();
// $empresa = new Empresas($db);
$search = new Search($db);
$data = json_decode(file_get_contents("php://input"));
$search->idUser = $data->idUser;
$search->limit = $data->limit ? $data->limit : 10;
$search->start = $data->page ? $search->limit * ($data->page-1)	 : 0;
$stmt = $search->searchByEmpresa();
$num = $stmt->rowCount();
	if ($num > 0) {
    $data = "";
  	$x = 1;
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
  		extract($row);
  		$data .= '{';
  		$data .= '"email": "' . $email . '",';
  		$data .= '"userName": "' . $userName . '",';
  		$data .= '"address": "' . $address . '",';
  		$data .= '"country": "' . $country . '",';
  		$data .= '"date": "' . $date . '",';
  		$data .= '"matches": "' . $matches . '",';
      $data .= '"name": "' . $name . '",';
  		$data .= '"source": "' . $source . '",';
  		$data .= '"term": "' . $term . '",';
  		$data .= '"type": "' . $type . '"';
  		$data .= '}';
  		$data .= $x < $num ? ',' : '';
  		$x++;
  	}

	echo '{"records": [' . $data . ']}';
}
