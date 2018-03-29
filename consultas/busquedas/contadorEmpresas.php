<?php
include_once dirname(__DIR__) . '/autoload.php';
$database = new Database();
$db = $database->getConnection();
$empresa = new Empresas($db);
$search = new Search($db);
$stmt = $empresa->readAll();
$num = $stmt->rowCount();
if ($num > 0) {
	$data = "";
	$x = 1;
	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		extract($row);
		$search->idCompany = $idCompany;
    $y = 1;
    $detalles = "";
		$query = $search->contadorByEmpresaGroup();
		$num2 = $query->rowCount();
		if ($num2 > 0) {
			while ($d = $query->fetch(PDO::FETCH_ASSOC)) {
        $contador = $d['contador'];
			}
		}
		$data .= '{';
		$data .= '"idCompany": "' . $idCompany . '",';
		$data .= '"contador":' . $contador ;
		$data .= '}';
		$data .= $x < $num ? ',' : '';
		$x++;
	}
	echo '{"records": [' . $data . ']}';
}
