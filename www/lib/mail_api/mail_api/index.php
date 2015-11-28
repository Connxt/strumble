<?php

require '../PHPMailerAutoload.php';

class Email_Sender{

    public function __construct() {
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
        header('Access-Control-Allow-Methods: GET, POST, PUT');
    }

    public function get_include_contents($filename, $variablesToMakeLocal) {
        extract($variablesToMakeLocal);
        if (is_file($filename)) {
            ob_start();
            include $filename;
            return ob_get_clean();
        }
            return false;
    }

    public function run(){
        date_default_timezone_set('Etc/UTC');
        $post_data = file_get_contents("php://input");
        $data = json_decode($post_data);
        
        //variables that will pass in the html content
        $variable = array(
            "client_name" => $data->clientName, 
            "sent_as" => $data->sentAs,
            "date_sent" => $data->dateSent,
            "units" => $data->units,
            "hours" => $data->hours,
            "minutes" => $data->minutes,
            "seconds" => $data->seconds,
            "milliSeconds" => $data->milliseconds,
            "matter" => $data->matter,
            "phase" => $data->phase,
            "narration" => $data->narration,
        );
        
        //Create a new PHPMailer instance
        $mail = new PHPMailer;

        // enable smtp for ssl support
        $mail->isSMTP();

        //Enable SMTP debugging
        // 0 = off (for production use)
        // 1 = client messages
        // 2 = client and server messages
        $mail->SMTPDebug = 2;

        //Ask for HTML-friendly debug output
        $mail->Debugoutput = 'html';

        //Set the hostname of the mail server
        $mail->Host = 'a2plcpnl0380.prod.iad2.secureserver.net';

        //Set the SMTP port number - 587 for authenticated TLS, a.k.a. RFC4409 SMTP submission
        $mail->Port = 465;

        //Set the encryption system to use - ssl (deprecated) or tls
        $mail->SMTPSecure = 'ssl';

        //Whether to use SMTP authentication
        $mail->SMTPAuth = true;

        //Username to use for SMTP authentication - use full email address for gmail
        $mail->Username = "superman2014";

        //Password to use for SMTP authentication
        $mail->Password = "sJRJI2014";

        //Set who the message is to be sent from
        $mail->setFrom($data->myDetails->email, $data->myDetails->name);
        
        //Set who the message is to be sent to
        foreach($data->recipientEmails as $email){
            $mail->addAddress($email->value);
        }

        //Set the subject line
        $mail->Subject = $data->clientName .", ". $data->matter .", ". $data->sentAs;

        //convert HTML into a basic plain-text alternative body
        $mail->Body = $this->get_include_contents('send_mail_body.php', $variable); 

        //Replace the plain text body with one created manually
        $mail->AltBody = 'This is a plain-text message body';

        //send the message, check for errors
        if (!$mail->send()) {
            echo "Mailer Error: " . $mail->ErrorInfo;
        } else {
            echo "Message sent!";
        }
    }
}

$app = new Email_Sender();
$app->run();

?>
