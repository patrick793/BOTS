<?php

include('config.php');
include('connect.php');

$studyName = $db->real_escape_string($_GET['studyName']);

if (!($studyName))
{
	echo "INSUFECIENT DATA";
	die;
}

$query = "INSERT INTO studies(study_name) VALUES('$studyName')";
	
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