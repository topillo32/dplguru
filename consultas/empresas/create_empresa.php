<?php
include_once dirname(__DIR__) . '/autoload.php';
$database = new Database();
$db = $database->getConnection();
$empresa = new Empresas($db);
$data = json_decode(file_get_contents("php://input"));
$empresa->name = $data->name;
$empresa->company = $data->company;
$empresa->activo = 1;
$empresa->titulo = $data->titulo;
$empresa->street = $data->street;
$empresa->city = $data->city;
$empresa->country = $data->country;
$empresa->zipcode = $data->zipcode;
$empresa->phone = $data->phone;
$last = $empresa->createEmpresa();
if ($last) {
	$json['datos'] = "Created Company";
}else{
	$json['datos'] = "Company not created";
}
echo json_encode(["records" => $json]);
