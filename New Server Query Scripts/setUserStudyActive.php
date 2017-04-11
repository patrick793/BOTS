<?php

include('config.php');
include('connect.php');

$studyid = $db->real_escape_string($_GET['studyID']);
$isActive = $db->real_escape_string($_GET['isActive']) == 'True'? '1':'0';

if ($isActive == null or $studyid == null)
{
	echo "Error";
	die;
}

$userQuery = "UPDATE studies SET Active = '$isActive' WHERE  STUDY_ID = '$studyid'";
$result = $db->query($userQuery);

if($result)
{
	echo "Success";
}

else
{
	echo "Error";
}

$db->close();
die;
?>
