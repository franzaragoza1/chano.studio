<?php 
	$nombre = $_POST['nombre'];
	$email = $_POST['email'];
	$asunto = 'Formulario Rellenado';
	$mensaje = "Nombre: ".$nombre."<br> Email: $email<br> Mensaje:".$_POST['mensaje'];


	if (mail('info@chano.studio', $asunto, $mensaje)) {
		header('Location: /thanks.html');
		exit;
	}
?>