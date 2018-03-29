<?php
class Usuarios {
	private $conn;
	private $table_name = "usuarios";
  protected $empresa;
	public $idUser;
	public $idCompany;
	public $email;
	public $password;
	public $permiso;
	public $userName;

	public function __construct($db) {
		$this->conn = $db;
		//$this->auth = new Auth($db);
	}

  public function readUsuarioLogin() {
  	$query = "SELECT email FROM " . $this->table_name . " WHERE email=:email  AND password=:password";
  	$stmt = $this->conn->prepare($query);
  	$stmt->bindParam(":email", $this->email);
		$stmt->bindParam(":password", $this->password);
		$stmt->execute();
    if ($stmt->execute()) {
      return $stmt;
    }
    return false;
	}

	public function readUsers() {
		$query = "SELECT email,userName,activo FROM " . $this->table_name . " WHERE permiso != 0";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		if ($stmt->execute()) {
			return $stmt;
		}
		return false;
	}

  public function login(){
    $query = "SELECT idUser,idCompany,email,password,permiso,userName,activo FROM " . $this->table_name . " WHERE email=:email";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":email", $this->email);
    if ($stmt->execute()) {
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      $this->idUser = $row['idUser'];
			$this->idCompany = $row['idCompany'];
			$this->email = $row['email'];
			$this->password = $row['password'];
			$this->permiso = $row['permiso'];
			$this->userName = $row['userName'];
			$this->activo = $row['activo'];
			return true;
    }
		print_r($stmt->errorInfo());
		return false;
  }

	public function createUsuario(){
			$query = "INSERT INTO " . $this->table_name . " SET  idCompany = :idCompany, email = :email , password = :password, userName = :userName, permiso = :permiso";
			$stmt = $this->conn->prepare($query);
			$stmt->bindParam(":idCompany", $this->idCompany);
			$stmt->bindParam(":email", $this->email);
			$stmt->bindParam(":password", $this->password);
			$stmt->bindParam(":userName", $this->userName);
			$stmt->bindParam(":permiso", $this->permiso);
			try {
				$stmt->execute();
				return $this->conn->lastInsertId();
				//return true;
			} catch (PDOException $e) {
				return FALSE;
			}
	}
	public function updatePassword() {
		$query = "UPDATE " . $this->table_name . " SET password = :password WHERE email = :email";
		$stmt = $this->conn->prepare($query);
		$this->email = htmlspecialchars(strip_tags($this->email));
		$this->password = htmlspecialchars(strip_tags($this->password));
		$stmt->bindParam(":email", $this->email);
		$stmt->bindParam(":password", $this->password);
		if ($stmt->execute()) {
			return TRUE;
		}
		return FALSE;
	}

	public function updateActivo() {
		$query = "UPDATE " . $this->table_name . " SET activo = :activo WHERE email = :email";
		$stmt = $this->conn->prepare($query);
		$stmt->bindParam(":email", $this->email);
		$stmt->bindParam(":activo", $this->activo);
		if ($stmt->execute()) {
			return TRUE;
		}
		return FALSE;
	}

	public function readOne() {
		$query = "SELECT idUser, email, userName, activo FROM " . $this->table_name . " WHERE email = :email ";
		$stmt = $this->conn->prepare($query);
		$stmt->bindParam(":email", $this->email);
		if ($stmt->execute()) {
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
			$this->idUser = $row['idUser'];
			$this->email = $row['email'];
			$this->userName = $row['userName'];
			$this->activo = $row['activo'];
      return true;
    }
		return false;
	}

	public function readOneGP() {
		$query = "SELECT idUser, email, userName, activo, password FROM " . $this->table_name . " WHERE idUser = :idUser ";
		$stmt = $this->conn->prepare($query);
		$stmt->bindParam(":idUser", $this->idUser);
		if ($stmt->execute()) {
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
			$this->idUser = $row['idUser'];
			$this->email = $row['email'];
			$this->userName = $row['userName'];
			$this->activo = $row['activo'];
			$this->password = $row['password'];
      return true;
    }
		return false;
	}
}
