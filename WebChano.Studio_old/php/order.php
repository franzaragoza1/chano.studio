<?php

$recipient_email = 'info@chano.studio'; // <--- ¡TU CORREO DEL ESTUDIO!

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Captura los datos del formulario
    $customer_name = $_POST['name'];
    $customer_email = $_POST['email'];
    $track_name = $_POST['track-name'];
    $artist_name = $_POST['artist-name'];
    $stems_link = $_POST['stems-link'];
    $special_instructions = $_POST['instructions'];

// --- Parte 1: Preparar el correo para el estudio ---
    $subject_to_studio = 'NEW ORDER PLACED: ' . $track_name . ' by ' . $artist_name;
    
    $mail_body_to_studio = "CUSTOMER NAME: " . $customer_name . "\n" .
                           "CUSTOMER EMAIL: " . $customer_email . "\n" .
                           "TRACK NAME: " . $track_name . "\n" .
                           "ARTIST NAME: " . $artist_name . "\n" .
                           "STEMS/TRACK LINK: " . $stems_link . "\n" .
                           "SPECIAL INSTRUCTIONS:\n" . $special_instructions . "\n\n";

    $headers_to_studio = "From: " . $customer_email . "\r\n";
    $headers_to_studio .= "Reply-To: " . $customer_email . "\r\n";
    $headers_to_studio .= "MIME-Version: 1.0\r\n";
    $headers_to_studio .= "Content-type: text/plain; charset=UTF-8\r\n";

    // --- Parte 2: Preparar el correo de confirmación para el cliente ---
    $recipient_email = 'info@chano.studio'; // Tu correo del estudio
    $customer_email_address = $customer_email; // La dirección del cliente que rellena el formulario

    $subject_to_customer = 'CHANO STUDIO: ORDER CONFIRMATION FOR YOUR SUBMISSION';
    
    $mail_body_to_customer = "HELLO " . strtoupper($customer_name) . ",\n\n" .
                             "THANK YOU FOR YOUR ORDER! THIS IS A CONFIRMATION THAT WE HAVE RECEIVED YOUR SUBMISSION WITH THE FOLLOWING DETAILS:\n\n" .
                             "--- YOUR ORDER DETAILS ---\n" .
                             "TRACK NAME: " . $track_name . "\n" .
                             "ARTIST NAME: " . $artist_name . "\n" .
                             "STEMS/TRACK LINK: " . $stems_link . "\n" .
                             "SPECIAL INSTRUCTIONS:\n" . $special_instructions . "\n" .
                             "--------------------------\n\n" .
                             "WE WILL REVIEW YOUR SUBMISSION AND GET BACK TO YOU SHORTLY.\n\n" .
                             "BEST REGARDS,\nCHANO STUDIO";

    $headers_to_customer = "From: " . $recipient_email . "\r\n"; // El estudio envía la copia
    $headers_to_customer .= "Reply-To: " . $recipient_email . "\r\n";
    $headers_to_customer .= "MIME-Version: 1.0\r\n";
    $headers_to_customer .= "Content-type: text/plain; charset=UTF-8\r\n";

    // --- Intentar enviar ambos correos y redirigir ---
    $mail_to_studio_sent = mail($recipient_email, $subject_to_studio, $mail_body_to_studio, $headers_to_studio);
    $mail_to_customer_sent = mail($customer_email_address, $subject_to_customer, $mail_body_to_customer, $headers_to_customer);

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