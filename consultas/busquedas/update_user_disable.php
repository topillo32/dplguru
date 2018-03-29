<?php
include_once dirname(__DIR__) . '/autoload.php';
$database = new Database();
$db = $database->getConnection();
$user = new Usuarios($db);
$data = json_decode(file_get_contents("php://input"));
if (isset($data->activo)) {
  $user->activo = $data->activo;
  $user->email = $data->email;
	$last = $user->updateActivo();
  $json['datos'] = "OK, User Updated";
}
else{
		$json['datos'] = "Error Disabled Value";
}
echo json_encode(["records" => $json]);
