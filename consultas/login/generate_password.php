<?php
include_once dirname(__DIR__) . '/autoload.php';
$database = new Database();
$db = $database->getConnection();
$auth = new Auth($db);
$users = new Usuarios($db);
$data = json_decode(file_get_contents("php://input"));
$users->idUser = $data->idUser;
if (isset($data->secretKey) && $data->secretKey != "") {
	$users->readOneGP();
	if ($data->secretKey == $users->password) {
		$users->password = $data->password;
		if (is_numeric($users->idUser) && $users->password != "") {
			$auth->pass = $data->password;
			$auth->email = $users->email;
			if ($auth->updatePassword()) {
				echo json_encode(array(
					"code" => 0,
				));
			} else {
				echo json_encode(array(
					"code" => 1,
				));
			}
		} else {
			echo json_encode(array(
				"code" => 1,
			));
		}
	} else {
		echo json_encode(array(
			"code" => 2,
		));
	}
}
