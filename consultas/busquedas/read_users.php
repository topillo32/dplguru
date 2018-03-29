<?php
include_once dirname(__DIR__) . '/autoload.php';
$database = new Database();
$db = $database->getConnection();
$users = new Usuarios($db);
$stmt = $users->readUsers();
$num = $stmt->rowCount();
if ($num > 0) {
	$data = "";
	$x = 1;
	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		extract($row);
		$data .= '{';
		$data .= '"email": "' . $email . '",';
    $data .= '"activo": ' . $activo . ',';
		$data .= '"userName": "' . $userName . '"';
		$data .= '}';
		$data .= $x < $num ? ',' : '';
		$x++;
	}
	echo '{"records": [' . $data . ']}';
}
