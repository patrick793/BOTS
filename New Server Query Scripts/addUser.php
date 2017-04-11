<?php

if (isset ($_GET['username']))
{
	$username= $_GET['username'];
	
}
else
{
	die("the username was not passed");
}

if(isset($_GET['uid'])){
	
	$userId=$_GET['uid'];
	
}else
{	
	die("the userId was not passed");
}


include("config.php"); 
include("connect.php");

$query = "INSERT IGNORE INTO users(USER_ID, username)
VALUES ($userId,'$username')";


$db->query($query);

	echo "\n";
	echo $userId;
	echo "\n";

	echo $username;
	echo "\n";

$db->close();
?>