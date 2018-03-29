<?php
include_once dirname(__DIR__) . '/autoload.php';
$database = new Database();
$db = $database->getConnection();
$login = new Login($db);
$data = json_decode(file_get_contents("php://input"));
$login->email = $data->email;
$login->password = $data->password;
$stmt = $login->readUsuarioLogin();
$num = $stmt->rowCount();
$data = "";
if($num > 0){
  $x = 1;
  while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    extract($row);
    $data .= '{"email": "'. $email . '"}';
    $data .= $x < $num ? ',' : '';
    $x++;
  }
    echo '{"records":[' . $data . ']}';
}
else{
    echo '{"records":[{"email": "false"}]}';
}
