<?php

require_once dirname(__DIR__) . '\vendor\autoload.php';

class Email {
	protected $server;
	protected $username;
	protected $password;
	public $email;
	public $razonSocialEnvia;
	public $razonSocialRecibe;
	public $file;
	public $asunto;
	public $mensaje;

	public function __construct($alias) {
		$this->username = $alias . '@dplguru.com';
		$this->password = 'L@h)Mh^,5WiC';
		$this->server = '{170.239.86.173:993/imap/ssl/novalidate-cert}INBOX';
	}

  public function enviar() {
    try {
      echo json_encode(array(
        "Estado" => "Enviando",
        "desde" => $this->username,
        "a" => $this->email,
      ));
      $transport = Swift_SmtpTransport::newInstance('mail.dplguru.com', '465', 'ssl')->setUsername($this->username)->setPassword($this->password);
      $mailer = Swift_Mailer::newInstance($transport);
      if (isset($this->file)) {
        $message = Swift_Message::newInstance($this->asunto)->setFrom(array(
          $this->username => $this->razonSocialEnvia,
        ))->setTo(array(
          $this->email => $this->razonSocialRecibe,
        ))->setBody($this->mensaje)->addPart($this->mensaje, 'text/html')->attach(Swift_Attachment::fromPath($this->file));
      } else {
        $message = Swift_Message::newInstance($this->asunto)->setFrom(array(
          $this->username => $this->razonSocialEnvia,
        ))->setTo(array(
          $this->email => $this->razonSocialRecibe,
        ))->setBody($this->mensaje)->addPart($this->mensaje, 'text/html');
      }
      if ($mailer->send($message)) {
        return true;
      }
      return false; 
      
      echo json_encode(array(
        "Estado" => "Enviado",
      ));

    } catch (Exception $e) {
      return $e->getMessage();
      echo json_encode(array(
        "Estado" => "Entre a catch",
      ));
    }
  }
}
