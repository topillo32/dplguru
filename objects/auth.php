<?php
class Auth {
	public $usuarios;
	public $password;
	public $email;
	public $permiso;
	public $activo;
	public $data;
	public $pass;

	public function __construct($db) {
		$this->conn = $db;
		$this->encriptacion = new Encriptacion;
		$this->usuarios = new Usuarios($db);
		$this->company = new Company($db);
	}

  public function login() {
		$this->usuarios->email = $this->email;
		$this->usuarios->login();

		$this->company->idCompany = $this->usuarios->idCompany;
		$this->company->readOne();
		if ($this->company->activo == '1') {
			if (!empty($this->usuarios->idUser)) {
				$row2 = array();
				$row2['id'] = $this->usuarios->idCompany;
				$row2['idUser'] = $this->usuarios->idUser;
				$row2['empresa'] = $this->company->company;
				$row2['nombreUsuario'] =$this->usuarios->userName;
				$row2['mail'] = $this->usuarios->email;
				$row2['permiso'] = $this->usuarios->permiso;
				if (isset($this->usuarios->password)) {
					$this->pass =  $this->usuarios->password;
					if ($this->usuarios->activo == 1 ) {
						if ($this->unlock() != $this->password) {
							return '{"code": 1, "error": "Wrong Password"}';
						}
						unset($this->usuarios->password);
						unset($this->pass);
						$this->data = $row2;
						return $this->generatorTokePersona();
					}
					return '{"code": 1, "error": "User not active"}';
				}
				return '{"code": 1, "error": "Password not configured"}';
			}
			return '{"code": 1, "error": "User not found"}';
		}
		return '{"code": 1, "error": "Suspended Company"}';
	}

	protected function unlock() {
		$this->encriptacion->data = $this->pass;
		$this->encriptacion->data = str_replace(SALT_KEY, '', $this->encriptacion->desencriptar());
		return $this->encriptacion->desencriptar();
	}

	protected function generatorTokePersona() {
		$token = ['iss' => $_SERVER['HTTP_USER_AGENT'], 'aud' => $this->data, 'iat' => time(), 'exp' => time() + 43200];
		$jwt = Firebase\JWT\JWT::encode($token, TOKEN_KEY);
		return '{"code":0,"response":{"token":"' . $jwt . '"}}';
	}

	public function updatePassword() {
		$this->generatorPassword();
		$this->usuarios->password = $this->pass;
		$this->usuarios->email = $this->email;
		if ($this->usuarios->updatePassword()) {
			return true;
		}
		return false;
	}

	protected function generatorPassword() {
		$this->encriptacion->data = $this->pass;
		$this->encriptacion->data = $this->encriptacion->encriptar() . SALT_KEY;
		$this->pass = $this->encriptacion->encriptar();
		return $this->pass;
	}

	public function createPassInicial() {
		$this->encriptacion->data = 'dplguru1234';
		$pass = $this->encriptacion->encriptar();
		$this->data = $pass;
		$this->usuarios->email = $this->email;
		$token = json_decode($this->generatorTokePersona());
		$token = $token->response->token;
		$this->usuarios->password = $pass;
		if ($this->usuarios->updatePassword()) {
			return $token;
		}
		return false;
	}


}
