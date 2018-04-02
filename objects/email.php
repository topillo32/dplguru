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
    echo json_encode(array(
        "Donde estoy" => "en EMAIL()",
    ));
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

      $transport = (new Swift_SmtpTransport('mail.dplguru.com', '465', 'ssl'))
        ->setUsername($this->username)
        ->setPassword($this->password);

      $mailer = new Swift_Mailer($transport);

      if (isset($this->file)) {

        $message =  (new Swift_Message($this->asunto))
          ->setFrom(array($this->username => $this->razonSocialEnvia,))
          ->setTo(array($this->email => $this->razonSocialRecibe,))
          ->setBody($this->mensaje)
          ->addPart($this->mensaje, 'text/html')
          ->attach(Swift_Attachment::fromPath($this->file));

          echo json_encode(array(
          "Estado" => "Enviando con file",
          "mensaje" => $message,
          "de" => $this->razonSocialEnvia,
          "a" => $this->razonSocialRecibe,
          ));

        $result = $mailer->send($message);

        if ($mailer->send($message)) {
          return true;
          echo json_encode(array(
          "Estado" => "Enviado",
          ));
        }
        return false;
        
      } else {
        $message =  (new Swift_Message($this->asunto))
          ->setFrom(array($this->username => $this->razonSocialEnvia,))
          ->setTo(array($this->email => $this->razonSocialRecibe,))
          ->setBody($this->mensaje)
          ->addPart($this->mensaje, 'text/html');

          echo json_encode(array(
          "Estado" => "Enviando sin file",
          "mensaje" => $this->asunto,
          "de" => $this->razonSocialEnvia,
          "a" => $this->razonSocialRecibe,
          ));

        $result = $mailer->send($message);

        echo json_encode(array(
          "Estado" => "waaaaaaaaaat",
          ));

        if ($mailer->send($message)) {
          return true;
          echo json_encode(array(
          "Estado" => "Enviado",
          ));
        }else{
          echo json_encode(array(
          "Estado" => "no enviado",
          ));
        }

        return false;
      }

    } catch (Exception $e) {
      return $e->getMessage();
      echo json_encode(array(
        "Estado" => "Entre a catch",
      ));
    }
  }
}
