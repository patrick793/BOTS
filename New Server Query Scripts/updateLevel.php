<?php

include('config.php');
include('connect.php');

chdir("../../botsFiles/Levels");


$user = $_POST['user'];
$userid = $_POST['userid']; 
$puzzleid = $_POST['puzzleid'];
$puzzle = $_POST['puzzle'];
$published = intval($_POST['published']);
$description = $_POST['description'];
$filename = $_POST['filename'];

$checkQuery = "SELECT * FROM puzzles WHERE USER_ID=$userid AND PUZZLE_ID=$puzzleid";
$result = $db->query($checkQuery);
if($result)
{
	if($result->num_rows == 0)
	{
		die("<html><h2>Level $puzzle doesn't exist yet.</h2></html>");
	}
}
else
{
	die("<html<h2>Error</h2></html>".$db->error);
}

if($published == 0)
{
	$query = "UPDATE puzzles SET description = '$description',  puzzle = '$puzzle', timeStamp = NOW() WHERE PUZZLE_ID = '$puzzleid';";
}
else
{
	//$query = "INSERT INTO puzzles(user, USER_ID, description, puzzle, published, timeStamp)  VALUES('$user', '$userid', '$description', '$puzzle', 1, NOW()) 
	//ON DUPLICATE KEY UPDATE published='1'";
}
$queryResult = $db->query($query);

if($queryResult)
{
	//successful update
}
else
{
	echo "<html><h2>Level $user-$puzzle doesn't exist</h2></html>";
}

if(isset($_POST['file']))
{
	$fileContents = stripslashes($_POST['file']);
	$result = file_put_contents($filename, $fileContents);
}

if($result == FALSE)
{
	echo "Error with file writing";
}
else
{
	echo "<html><h2>Level $filename updated.</h2></html>";
}
$db->close();
?>