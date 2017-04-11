<?php

include('config.php');
include('connect.php');

chdir("../../botsFiles/LogFiles");

$userid = (string)$_POST['userid']; 
$puzzle = (string)$_POST['puzzleid'];
$attempt = (string)$_POST['attempt'];
$fileContents = (string)$_POST['file'];
$timestamp = date("F j, Y, g:i a");

$filename = $userid . '-' . $puzzle . '-' . $timestamp . ".txt";

if(isset($_POST['file']))
{
	if(isset($_POST['success']) && $_POST['success'] == 1)
	{
		if(file_exists ($filename))
		{
			$result = file_put_contents($filename, $fileContents, FILE_APPEND);
			$result = file_put_contents($filename, "Completed at " . $timestamp, FILE_APPEND);
		}
	}
	else
		$result = file_put_contents($filename, $fileContents, FILE_APPEND);
}
if($result == FALSE)
{
	echo "Error with file writing";
}
else
{
	echo "<html><h2>Level $filename added.</h2></html>";
}


$db->close();
?>