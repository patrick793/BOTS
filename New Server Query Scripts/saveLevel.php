<?php

include('config.php');
include('connect.php');

chdir("../../botsFiles/Levels");


$user = $_POST['user'];
$userid = $_POST['userid']; 
$puzzle = $_POST['puzzle'];
$version = $_POST['version'];
$published = intval($_POST['published']);
$description = $_POST['description'];

$checkQuery = "SELECT * FROM puzzles WHERE USER_ID=$userid AND puzzle='$puzzle'";
$result = $db->query($checkQuery);
if($result)
{
	// if($result->num_rows > 0)
	// {
		// die("<html><h2>Level $puzzle is already published</h2></html>");
	// }
}
else
{
	die("<html><h2>Error</h2></html>".$db->error);
}

if($published == 0)
{
	$query = "INSERT INTO puzzles(user, USER_ID, description, puzzle, published, timeStamp, version)  VALUES('$user', '$userid', '$description','$puzzle', 0, NOW(), '$version') 
	ON DUPLICATE KEY UPDATE timeStamp=NOW()";
}
else
{
	$query = "INSERT INTO puzzles(user, USER_ID, description, puzzle, published, timeStamp, version)  VALUES('$user', '$userid', '$description', '$puzzle', 1, NOW(), '$version') 
	ON DUPLICATE KEY UPDATE published='1'";
}
$queryResult = $db->query($query);
$filename = $db->insert_id.".xml";

if($queryResult)
{
	//Do nothing
}
else
{
	die("<html><h2>Level $user-$puzzle already exists</h2></html>".$db->error);
}


$fileContents = stripslashes($_POST['file']);
if(isset($_POST['file']))
{
	$result = file_put_contents($filename, $fileContents);
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