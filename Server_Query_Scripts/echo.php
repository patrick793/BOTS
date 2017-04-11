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

if($folderName == "Levels")
{
	$pos = stripos($fileName2, "-");
	$user = substr($fileName2, 0, ($pos));
	$puzzle = substr($fileName2, ($pos + 1));
	$description = $_POST['description'];
	$checkQuery = "SELECT published FROM Levels WHERE user='$user' AND puzzle='$puzzle' AND published='1'";
	$result = $db->query($checkQuery);
	if($result)
	{
		if($result->num_rows > 0)
		{
			die("<html><h2>Level $puzzle is already published</h2></html>");
		}
	}
	else
	{
		die("<html<h2>Error</h2></html>".$db->error);
	}
	if(isset($_POST['token']) && $_POST['token'] == "save")
	{
		$query = "INSERT INTO Levels(user, description, puzzle, published, timeStamp)  VALUES('$user', '$description','$puzzle', 0, NOW()) 
		ON DUPLICATE KEY UPDATE timeStamp=NOW()";
	}
	else
	{
		$query = "INSERT INTO Levels(user, description, puzzle, published, timeStamp)  VALUES('$user', '$description','$puzzle', 1, NOW()) 
		ON DUPLICATE KEY UPDATE published='1'";
	}
	$queryResult = $db->query($query);
	if($queryResult)
	{
		//Do nothing
	}
	else
	{
		die("<html><h2>Level $user-$puzzle already exists</h2></html>".$db->error);
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
	if($folderName == "Levels")
	{
		echo "<html><h2>Level ".$_POST['fileName']." added.</h2></html>";
	}
	else
	{
		echo "<html><h2>XML puzzle ".$_POST['fileName']." has been submitted to folder ".$folderName.".</h2></html>";
	}
}
$db->close();
?>