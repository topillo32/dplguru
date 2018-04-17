<?php
use PHPMailer\PHPMailer\PHPMailer;

// require_once dirname(__DIR__) . '\vendor\autoload.php';
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
	$mail = new PHPMailer;

	public function __construct($alias) {
		$this->username = $alias . '@gmail.com';
		$this->password = 'dplguru1234';
		$this->server = '{170.239.86.173:993/imap/ssl/novalidate-cert}INBOX';
	}

	public function enviar() {
		/*
		try {
		$mail->SMTPDebug = 1;                                 // Enable verbose debug output
		$mail->isSMTP();                                      // Set mailer to use SMTP
		$mail->SMTPOptions = array(
				'ssl' => array(
				'verify_peer' => false,
				'verify_peer_name' => false,
				'allow_self_signed' => true
				)
		);
		$mail->Host = 'smtp.gmail.com';  // Specify main and backup SMTP servers
		$mail->SMTPAuth = true;                               // Enable SMTP authentication
		$mail->Username = $this->username;                 // SMTP username
		$mail->Password = $this->password;                           // SMTP password
		$mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
		$mail->Port = 587;                                    // TCP port to connect to
		//Recipients
		$mail->setFrom($this->username, 'DPLGURU');
		$mail->addAddress($this->email, $this->razonSocialRecibe);     // Add a recipient
		$mail->isHTML(true);                                  // Set email format to HTML
		$mail->Subject = $this->asunto;
		$mail->Body    = $this->mensaje;
		// $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

		$mail->send();
		echo 'Message has been sent';
		} catch (Exception $e) {
				echo 'Message could not be sent.';
				echo 'Mailer Error: ' . $mail->ErrorInfo;
		}
*/
	}
}
