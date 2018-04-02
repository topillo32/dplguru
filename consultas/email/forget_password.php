<?php
include_once dirname(__DIR__) . '/autoload.php';
$database = new Database();
$db = $database->getConnection();
$auth = new Auth($db);
$users = new Usuarios($db);
$data = json_decode(file_get_contents("php://input"));
$auth->email = $data->email;
$users->email = $data->email;
if (isset($auth->email) && $auth->email != "") {
  	$users->readOne();
	$tokenuser = $auth->createPassInicial();
	$mensaje = 'Por favor haga click en el siguiente <a href="https://dplguru.com/#/changepasswd/' . $tokenuser . '/' . $users->idUser . '">link</a> para generar una clave';
	echo json_encode(array(
		"paso" => 3,
		"donde estoy" => "cuerpo del mail listo, ahora se instanciara la clase email",
		"tokenuser" => $tokenuser,
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
		"donde estoy" => "Email() Enviar",
	));
	$email->enviar();
	echo json_encode(array(
		"code" => 0,
		"donde estoy" => "cierre de forget.password",
	));
} else {
	echo json_encode(array(
		"code" => 1,
	));
}
