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

        $FROM_EMAIL = $this->username;//$this->razonSocialEnvia;
        // they dont like when it comes from @gmail, prefers business emails
        $TO_EMAIL = $this->email;//$this->razonSocialRecibe;
        // Try to be nice. Take a look at the anti spam laws. In most cases, you must
        // have an unsubscribe. You also cannot be misleading.
        $subject = $this->asunto;
        $from = new SendGrid\Email(null, $FROM_EMAIL);
        $to = new SendGrid\Email(null, $TO_EMAIL);
        $htmlContent = $this->mensaje;
        // Create Sendgrid content
        $content = new SendGrid\Content("text/html",$htmlContent);
        // Create a mail object
        $mail = new SendGrid\Mail($from, $subject, $to, $content);
        
        $sg = new \SendGrid('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');
        $response = $sg->client->mail()->send()->post($mail);
            
        if ($response->statusCode() == 202) {
          // Successfully sent
          echo 'done';
        } else {
          echo 'false';
        }

    } catch (Exception $e) {
      return $e->getMessage();
      echo json_encode(array(
        "Estado" => "Entre a catch",
      ));
    }
  }
}
