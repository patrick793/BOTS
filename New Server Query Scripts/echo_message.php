<?php

include('config.php');
include('connect.php');

if(isset($_POST['folderName']))
{
	$folderName = $_POST['folderName'];
}
else
{
	die("<html><h2>Folder Name is not set</h2></html>");
}

chdir("../../botsFiles/".$folderName);
$fileName = $db->escape_string($_POST['fileName']).".xml";
$fileName2 = $db->escape_string($_POST['fileName']);

if($folderName == "Message")
{
	$pos = stripos($fileName2, "-");
	$user = substr($fileName2, 0, ($pos));
	$message = substr($fileName2, ($pos));
	$sender = $_POST['sender'];
	$checkQuery = "SELECT FROM Levels WHERE username='$user' AND sender = '$sender' AND message='$message'";
	$result = $db->query($checkQuery);
	if($result)
	{
		if($result->num_rows > 0)
		{
			die("<html><h2>Level $message is already published</h2></html>");
		}
	}
	else
	{
		die("<html<h2>Error</h2></html>".$db->error);
	}
	if(isset($_GET['token']) && $_GET['token'] == "save")
	{
		$query = "INSERT INTO Levels(username, sender, message, timeStamp)  VALUES('$user', '$sender','$message', NOW()) 
		ON DUPLICATE KEY UPDATE timeStamp=NOW()";
	}
	else
	{
		$query = "INSERT INTO Levels(username, sender, message, timeStamp)  VALUES('$user', '$sender','$message', NOW()) 
		";
	}
	$queryResult = $db->query($query);
	if($queryResult)
	{
		//Do nothing
	}
	else
	{
		die("<html><h2>Level $user-$message already exists</h2></html>".$db->error);
	}
}

$fileContents = stripslashes($_POST['file']);
if(isset($_POST['file']))
{
	$result = file_put_contents($fileName, $fileContents);
}
if($result == FALSE)
{
	echo "Error with file writing";
}
else
{
	if($folderName == "Message")
	{
		echo "<html><h2>Level ".$_POST['fileName']." added.</h2></html>";
	}
	else
	{
		echo "<html><h2>XML Message ".$_POST['fileName']." has been submitted to folder ".$folderName.".</h2></html>";
	}
}
$db->close();
?>