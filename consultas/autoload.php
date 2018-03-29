<?php
header('Content-Type: application/json');
include_once dirname(__DIR__) . '/config/config.php';
include_once dirname(__DIR__) . '/config/database.php';
include_once dirname(__DIR__) . '/vendor/autoload.php';
spl_autoload_register(function ($clase) {
	$file = lcfirst($clase);
	include_once dirname(__DIR__) . '/objects/' . $file . '.php';
});
/*$token = new Token;
if (isset($_SERVER["HTTP_GLOBALPERM"]) && ($_SERVER["HTTP_GLOBALPERM"] == 'login' || $_SERVER["HTTP_GLOBALPERM"] == 'portaldte')) {
	echo $token->readToken();
} else {
	$token->readToken();
}*/
