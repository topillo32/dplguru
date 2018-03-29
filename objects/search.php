<?php
class Search {
	private $conn;
	private $table_name = "search";
	public $idSearch;
	public $idUser;
	public $keyword;
	public $date;
	public $matches;
	public $page;
	public $limit;

	public function __construct($db) {
		$this->conn = $db;
	}

  public function create() {
  	$query = "INSERT INTO " . $this->table_name . " SET idUser = :idUser, matches = :matches,term = :term, type = :type,name = :name,source = :source, country = :country, address = :address";
  	$stmt = $this->conn->prepare($query);
		$this->term = $this->nullify($this->term);
		$this->type = $this->nullify($this->type);
		$this->name = $this->nullify($this->name);
		$this->source = $this->nullify($this->source);
		$this->address = $this->nullify($this->address);
		$this->country = $this->nullify($this->country);
  	$stmt->bindParam(":idUser", $this->idUser);
		$stmt->bindParam(":term", $this->term);
		$stmt->bindParam(":type", $this->type);
		$stmt->bindParam(":name", $this->name);
		$stmt->bindParam(":source", $this->source);
		$stmt->bindParam(":country", $this->country);
		$stmt->bindParam(":address", $this->address);
		$stmt->bindParam(":matches", $this->matches);
		try {
			$stmt->execute();
			return $this->conn->lastInsertId();
		} catch (PDOException $e) {
			return FALSE;
		}
	}
	public function readByEmpresa(){
		$query = "SELECT s.date,s.term,s.name,s.address,s.country,s.type,s.source,s.matches,s.date,u.userName,u.email FROM " . $this->table_name . " s INNER JOIN usuarios u ON u.idUser = s.idUser WHERE u.idCompany = (SELECT idCompany FROM usuarios WHERE idUser = 2) LIMIT ".$this->start." , ".$this->limit;
  	$stmt = $this->conn->prepare($query);
		$stmt->bindParam(":idUser", $this->idUser);
		if ($stmt->execute()) {
			return $stmt;
		}
		return FALSE;
	}
	public function readByEmpresaGroup(){
		$query = "SELECT s.date,s.term,s.name,s.address,s.country,s.type,s.source,s.matches,s.date,u.userName,u.email FROM " . $this->table_name . " s INNER JOIN usuarios u ON u.idUser = s.idUser WHERE u.idCompany = :idCompany LIMIT ".$this->start." , ".$this->limit;
  	$stmt = $this->conn->prepare($query);
		$stmt->bindParam(":idCompany", $this->idCompany);
		$stmt->execute();
		return $stmt;
	}
	public function readAllSearches(){
		$query = "SELECT term,name,address,country,type,source,matches,date FROM " . $this->table_name . " WHERE idUser = :idUser LIMIT ".$this->start." , ".$this->limit;
  	$stmt = $this->conn->prepare($query);
		$stmt->bindParam(":idUser", $this->idUser);
		if ($stmt->execute()) {
			return $stmt;
		}
		return FALSE;
	}
	public function readAll(){
		$query = "SELECT s.term,s.name,s.address,s.country,s.type,s.source,s.matches,s.date, u.userName,u.email FROM " . $this->table_name . " s INNER JOIN usuarios u ON u.idUser = s.idUser LIMIT ".$this->start." , ".$this->limit;
  	$stmt = $this->conn->prepare($query);
		if ($stmt->execute()) {
			return $stmt;
		}
		return FALSE;
	}
	public function contadorAll(){
		$query = "SELECT COUNT(idSearche) as contador FROM " . $this->table_name;
		$stmt = $this->conn->prepare($query);
		if ($stmt->execute()) {
			return $stmt;
		}
		return FALSE;
	}

	public function contadorUser(){
		$query = "SELECT COUNT(idSearche) as contador FROM " . $this->table_name . " WHERE idUser = :idUser";
  	$stmt = $this->conn->prepare($query);
		$stmt->bindParam(":idUser", $this->idUser);
		if ($stmt->execute()) {
			return $stmt;
		}
		return FALSE;
	}
	public function contadorByEmpresaGroup(){
		$query = "SELECT COUNT(idSearche) as contador FROM " . $this->table_name . " s INNER JOIN usuarios u ON u.idUser = s.idUser WHERE u.idCompany = :idCompany";
		$stmt = $this->conn->prepare($query);
		$stmt->bindParam(":idCompany", $this->idCompany);
		$stmt->execute();
		return $stmt;
	}

	public function contadorByEmpresa(){
		$query = "SELECT COUNT(s.idSearche) as contador FROM " . $this->table_name . " s INNER JOIN usuarios u ON u.idUser = s.idUser WHERE u.idCompany = (SELECT idCompany FROM usuarios WHERE idUser = :idUser)";
  	$stmt = $this->conn->prepare($query);
		$stmt->bindParam(":idUser", $this->idUser);
		if ($stmt->execute()) {
			return $stmt;
		}
		return FALSE;
	}



	private function nullify($property) {
		if ($property == "") {
			return NULL;
		}
		return htmlspecialchars(strip_tags($property));
	}



}
