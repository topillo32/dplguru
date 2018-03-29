<?php
class Company {
	private $conn;
	private $table_name = "empresa";
  public $idCompany;
  public $name;
  public $company;
  public $titulo;
  public $street;
  public $city;
  public $zipcode;
  public $phone;
  public $activo;

  public function __construct($db) {
		$this->conn = $db;
	}

  public function readOne() {
    $query = "SELECT idCompany,name,company,titulo,street,city,zipcode,phone,activo FROM " . $this->table_name . " WHERE idCompany = :idCompany";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":idCompany", $this->idCompany);
    if ($stmt->execute()) {
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      $this->idCompany = $row['idCompany'];
			$this->name = $row['name'];
			$this->company = $row['company'];
			$this->titulo = $row['titulo'];
			$this->street = $row['street'];
			$this->city = $row['city'];
			$this->zipcode = $row['zipcode'];
			$this->phone = $row['phone'];
      $this->activo = $row['activo'];
      return true;
    }
    return false;
  }
}
