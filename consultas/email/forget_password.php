<?php
include_once dirname(__DIR__) . '/autoload.php';
$database = new Database();
$db = $database->getConnection();
$auth = new Auth($db);
$users = new Usuarios($db);
$data = json_decode(file_get_contents("php://input"));
$auth->email = $data->email;
$users->email = $data->email;
echo json_encode(array(
		"auth-email" => $auth->email,
		"users-email" => $users->email,
	));
if (isset($auth->email) && $auth->email != "") {
	echo json_encode(array(
		"paso" => 0,
		"donde estoy" => "entre a el if del mail",
	));
  	$users->readOne(); 
  	echo json_encode(array(
		"paso" => 1,
		"donde estoy" => "antes de $auth->createPassInicial()",
	));
	$tokenuser = $auth->createPassInicial();
	echo json_encode(array(
		"paso" => 2,
		"donde estoy" => "asigno el tokenuser",
	));
	$mensaje = 'Por favor haga click en el siguiente <a href="https://dplguru.com/#/changepasswd/' . $tokenuser . '/' . $users->idUser . '">link</a> para generar una clave';
	echo json_encode(array(
		"paso" => 3,
		"donde estoy" => "cuerpo del mail listo, ahora se instanciara la clase email",
	));
	$email = new Email("resetpassword");
	echo json_encode(array(
		"paso" => 4,
		"donde estoy" => "Email() instanciado",
	));
	$email->asunto = "Generar clave de usuario";
	$email->razonSocialRecibe = $users->userName;
	$email->razonSocialEnvia = "Dplguru";
	$email->email = $data->email;
	$email->mensaje = $mensaje;
	echo json_encode(array(
		"paso" => 1,
		"donde estoy" => "Email() Enviado",
	));
	$email->enviar();
	echo json_encode(array(
		"code" => 0,
		"donde estoy" => "Email enviado",
	));
} else {
	echo json_encode(array(
		"code" => 1,
	));
}
