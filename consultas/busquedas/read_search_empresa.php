<?php
include_once dirname(__DIR__) . '/autoload.php';
$database = new Database();
$db = $database->getConnection();
$empresa = new Empresas($db);
$search = new Search($db);
$datax = json_decode(file_get_contents("php://input"));
$search->start = 0;
$search->limit = 10;
$stmt = $empresa->readAll();
$num = $stmt->rowCount();
if ($num > 0) {
	$data = "";
	$x = 1;
	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		extract($row);
		$search->idCompany = $idCompany;

		if (count($datax->query) > 0) {
			$search->limit = $datax->query[$x-1]->limit ?: 10;
			$search->start = $datax->query[$x-1]->page ? $datax->query[$x-1]->limit * ($datax->query[$x-1]->page-1)	 : 0;
		}
		$query = $search->readByEmpresaGroup();
		$y = 1;
		$num2 = $query->rowCount();
		$detalles = "";
		if ($num2 > 0) {
			while ($d = $query->fetch(PDO::FETCH_ASSOC)) {
				$detalles .= '{';
				$detalles .= '"email":"'. $d['email'] .'",';
				$detalles .= '"userName":"'. $d['userName'] .'",';
				$detalles .= '"address":"'. $d['address'] .'",';
				$detalles .= '"country":"'. $d['country'] .'",';
				$detalles .= '"date":"'. 		$d['date'] .'",';
				$detalles .= '"matches":"'. $d['matches'] .'",';
				$detalles .= '"name":"'. 		$d['name'] .'",';
				$detalles .= '"source":"'. 	$d['source'] .'",';
				$detalles .= '"term":"'. 		$d['term'] .'",';
				$detalles .= '"type":"'. 		$d['type'] .'"';
				$detalles .= '}';
				$detalles .= $y < $num2 ? ',' : '';
				$y++;
			}
		}

		$data .= '{';
		$data .= '"idCompany": "' . $idCompany . '",';
		$data .= '"name": "' . $name . '",';
		$data .= '"company": "' . $company . '",';
		$data .= '"detalle":[' . $detalles . ']';
		$data .= '}';
		$data .= $x < $num ? ',' : '';
		$x++;
	}
	echo '{"records": [' . $data . ']}';
}
