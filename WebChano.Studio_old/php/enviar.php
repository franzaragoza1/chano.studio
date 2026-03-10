<?php

$recipient_email = 'info@chano.studio'; // TU CORREO DEL ESTUDIO

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Captura los datos del formulario
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];

    // --- Parte 1: Preparar el correo para el estudio ---
    $subject_to_studio = 'NEW CONTACT FORM: ' . $name; // Corregida la variable 'Form'
    
    $mail_body_to_studio = "NAME: " . $name . "\n" .
                           "EMAIL: " . $email . "\n" .
                           "MESSAGE:\n" . $message . "\n\n";

    $headers_to_studio = "From: " . $email . "\r\n";
    $headers_to_studio .= "Reply-To: " . $email . "\r\n";
    $headers_to_studio .= "MIME-Version: 1.0\r\n";
    $headers_to_studio .= "Content-type: text/plain; charset=UTF-8\r\n";

    // --- Parte 2: Preparar el correo de confirmación para el cliente ---
    // La dirección del cliente que rellena el formulario es directamente $email
    
    $subject_to_customer = 'CHANO STUDIO: FORM RECEIVED';
    
    $mail_body_to_customer = "HELLO " . strtoupper($name) . ",\n\n" .
                             "THANKS FOR GETTING IN TOUCH. WE WILL GET BACK TO YOU SHORTLY.\n" . // Corregida la concatenación y añadido \n
                             "NAME: " . $name . "\n" .
                             "EMAIL: " . $email . "\n" .
                             "MESSAGE:\n" . $message . "\n\n" .
                             "BEST REGARDS,\nCHANO STUDIO"; // Corregida la concatenación final

    $headers_to_customer = "From: " . $recipient_email . "\r\n";
    $headers_to_customer .= "Reply-To: " . $recipient_email . "\r\n";
    $headers_to_customer .= "MIME-Version: 1.0\r\n";
    $headers_to_customer .= "Content-type: text/plain; charset=UTF-8\r\n";

    // --- Intentar enviar ambos correos y redirigir ---
    $mail_to_studio_sent = mail($recipient_email, $subject_to_studio, $mail_body_to_studio, $headers_to_studio);
    $mail_to_customer_sent = mail($email, $subject_to_customer, $mail_body_to_customer, $headers_to_customer); // Usando $email directamente

    if ($mail_to_studio_sent && $mail_to_customer_sent) {
        header('Location: /thanks.html');
        exit;
    } else {
        header('Location: /error.html');
        exit;
    }

} else {
    // Si se intenta acceder al script directamente sin un POST
    header('Location: /index.html');
    exit;
}