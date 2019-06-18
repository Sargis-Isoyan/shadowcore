<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Example: File Upload</title>
</head>
<body>
<?php

$funcNum = $_GET['CKEditorFuncNum'] ;

$uploadfile = 'uploads/images/' . time() . rand(0,9) . '.jpg';
if (move_uploaded_file($_FILES['upload']['tmp_name'], $uploadfile)) {
    $url = 'https://serebrumlab.com/shadowcore/api/' . $uploadfile;
	$message = 'The uploaded file has been renamed';    
} else {
	// Check the $_FILES array and save the file. Assign the correct path to a variable ($url).
	$url = '';
	// Usually you will only assign something here if the file could not be uploaded.
	$message = 'The uploaded was failed';    
}
echo "<script type='text/javascript'>window.parent.CKEDITOR.tools.callFunction($funcNum, '$url', '$message');</script>";
?>

</body>
</html>