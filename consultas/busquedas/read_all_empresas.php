<?php
include_once dirname(__DIR__) . '/autoload.php';
$database = new Database();
$db = $database->getConnection();
$empresa = new Empresas($db);
$stmt = $empresa->readCompany();
$num = $stmt->rowCount();
if ($num > 0) {
	$data = "";
	$x = 1;
	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		extract($row);
		$data .= '{';
		$data .= '"idCompany": "' . $idCompany . '",';
		$data .= '"name": "' . $name . '",';
		$data .= '"company": "' . $company . '",';
		$data .= '"titulo": "' . $titulo . '",';
		$data .= '"street": "' . $street . '",';
		$data .= '"city": "' . $city . '",';
    $data .= '"country": "' . $country . '",';
		$data .= '"zipcode": "' . $zipcode . '",';
		$data .= '"phone": "' . $phone . '",';
		$data .= '"activo": "' . $activo . '"';
		$data .= '}';
		$data .= $x < $num ? ',' : '';
		$x++;
	}
	echo '{"records": [' . $data . ']}';
}
