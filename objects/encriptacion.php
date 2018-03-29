<?php
class Encriptacion {
	protected $certkey;
	protected $iv;
	public $data;

	public function __construct() {
		$this->certkey = CERT_KEY;
		$this->iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length(CIPHER_METHOD));
	}

	public function encriptar() {
		return base64_encode(base64_encode($this->iv) . ':' . openssl_encrypt($this->data, CIPHER_METHOD, $this->certkey, 0, $this->iv));
	}

	public function desencriptar() {
		$parts = explode(':', base64_decode($this->data), 2);
		return openssl_decrypt($parts[1], CIPHER_METHOD, $this->certkey, 0, base64_decode($parts[0]));
	}
}
