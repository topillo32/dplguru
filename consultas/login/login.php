<?php
include_once dirname(__DIR__) . '/autoload.php';
$database = new Database();
$db = $database->getConnection();
$auth = new Auth($db);
$data = json_decode(file_get_contents("php://input"));

if (isset($data->email) and isset($data->password)) {
	$auth->email = $data->email;
	$auth->password = $data->password;
	$login = $auth->login();
	echo $login;
}
