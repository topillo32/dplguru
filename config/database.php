<?php
class Database {
	private $host = DB_HOST;
	private $db_name = DB_UNICA;
	private $username = DB_USERNAME;
	private $password = DB_PASSWORD;
	public $conn;

	public function getConnection() {
		$this->conn = null;
		try {
			$this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password, array(
				PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8",
				PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
			));
		} catch (PDOException $exception) {
			echo "Error Al conectar a la DB: " . $exception->getMessage();
			exit;
		}
		return $this->conn;
	}
}
