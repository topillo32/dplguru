<?php
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
		$this->username = $alias . '@contalerp.cl';
		$this->password = 'DKQoI^R0B7;R';
		$this->server = '{170.239.86.173:993/imap/ssl/novalidate-cert}INBOX';
	}


  public function enviar() {
    try {
      $transport = Swift_SmtpTransport::newInstance('email-smtp.eu-west-1.amazonaws.com', '465', 'ssl')->setUsername('AKIAIYZWGUCYTZIB22XQ')->setPassword('AgO+0wbL0vTrPVq3HNw+FjjfU32WFTUaYNa0HuVu/jGt');
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
    } catch (Exception $e) {
      return $e->getMessage();
    }
  }
}
