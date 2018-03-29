<?php
class Empresas {
  private $conn;
  private $table_name = "empresa";
  public $idCompany;
  public $name;
  public $company;
  public $titulo;
  public $street;
  public $city;
  public $zipcode;
  public $country;
  public $phone;
  public $activo;

  public function __construct($db) {
    $this->conn = $db;
  }

  public function readAll() {
    $query = "SELECT idCompany,name,company,titulo,street,city,zipcode,phone,activo,country FROM " . $this->table_name . " ORDER BY idCompany";
    $stmt = $this->conn->prepare($query);
    if ($stmt->execute()) {
      return $stmt;
    }
    return FALSE;
  }

  public function createEmpresa(){
      $query = "INSERT INTO " . $this->table_name . " SET  name = :name, company = :company , titulo = :titulo, street = :street, city = :city, zipcode = :zipcode, phone = :phone, activo = :activo ,country = :country";
      $stmt = $this->conn->prepare($query);
      $stmt->bindParam(":name", $this->name);
      $stmt->bindParam(":company", $this->company);
      $stmt->bindParam(":titulo", $this->titulo);
      $stmt->bindParam(":street", $this->street);
      $stmt->bindParam(":city", $this->city);
      $stmt->bindParam(":zipcode", $this->zipcode);
      $stmt->bindParam(":phone", $this->phone);
      $stmt->bindParam(":activo", $this->activo);
      $stmt->bindParam(":country", $this->country);
      try {
        $stmt->execute();
        return $this->conn->lastInsertId();
        //return true;
      } catch (PDOException $e) {
        return FALSE;
      }
  }

  public function readCompany() {
		$query = "SELECT idCompany,name,company,titulo,street,city,zipcode,phone,activo,country FROM " . $this->table_name . " WHERE idCompany != 1 ORDER BY name";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		if ($stmt->execute()) {
			return $stmt;
		}
		return false;
	}

  public function updateActivo() {
    $query = "UPDATE " . $this->table_name . " SET activo = :activo WHERE idCompany = :idCompany";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":idCompany", $this->idCompany);
    $stmt->bindParam(":activo", $this->activo);
    if ($stmt->execute()) {
      return TRUE;
    }
    return FALSE;
  }

}
