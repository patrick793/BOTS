<?php

include('config.php');
include('connect.php');

$sender = $db->real_escape_string($_GET['sender']);
$userid = $db->real_escape_string($_GET['userid']); 
$puzzle = $db->real_escape_string($_GET['puzzle']);
$message = $db->real_escape_string($_GET['message']);

if (!($sender) or !($userid) or !($message))
{
	echo "INSUFECIENT DATA";
	die;
}

if ($puzzle)
{
	$query = "INSERT INTO messages(USER_ID, sender, message, PUZZLE_ID) VALUES('$userid', '$sender', '$message', '$puzzle')";
}
else
{
	$query = "INSERT INTO messages(USER_ID, sender, message, PUZZLE_ID) VALUES('$userid', '$sender', '$message', NULL)";
}

	
$queryResult = $db->query($query);

if($queryResult)
{
	echo "SUCCESS";
}
else
{
	echo "ERROR";
}

$db->close();
die;
?>