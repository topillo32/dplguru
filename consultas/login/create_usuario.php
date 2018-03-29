<?php
include_once dirname(__DIR__) . '/autoload.php';
$database = new Database();
$db = $database->getConnection();
$user = new Usuarios($db);
$auth = new Auth($db);
$data = json_decode(file_get_contents("php://input"));
if (isset($data->email) and isset($data->password)) {
	$user->email = $data->email;
	$user->password = $data->password;
  $user->idCompany = $data->idCompany;
  $user->userName = $data->userName;
  $user->permiso = $data->permiso;
	$last = $user->createUsuario();
	if ($last) {
		$auth->email = $data->email;
		$auth->pass = $data->password;
		$auth->updatePassword();
		$json['datos'] = "Created User";
	}else{
		$json['datos'] = "User not created";
	}
}
else{
		$json['datos'] = "Without email - Without Password";
}
echo json_encode(["records" => $json]);
