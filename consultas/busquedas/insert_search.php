<?php
include_once dirname(__DIR__) . '/autoload.php';
$database = new Database();
$db = $database->getConnection();
$search = new Search($db);
$data = json_decode(file_get_contents("php://input"));
$search->idUser = $data->idUser;
$search->term = $data->term;
$search->type = $data->type;
$search->name = $data->name;
$search->source = $data->source;
$search->country = $data->country;
$search->address = $data->address;
$search->matches = $data->matches;
if ($search->create()) {
	echo '{"records":"Exito"}';
	return true;
} else {
	echo '{"records":"No realizo el delete"}';
}
