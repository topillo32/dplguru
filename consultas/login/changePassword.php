<?php
include_once dirname(__DIR__) . '/autoload.php';
$database = new Database();
$db = $database->getConnection();
$auth = new Auth($db);
$data = json_decode(file_get_contents("php://input"));
$auth->email = $data->email;
$auth->pass = $data->password;
if ($auth->password != "") {
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
