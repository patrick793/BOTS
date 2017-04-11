<?php

include('config.php');
include('connect.php');

$userid = $db->real_escape_string($_GET['userid']);

if ($userid == "ALL")
{
	$userQuery = "SELECT username, version, current_study_id, isAdmin FROM users";
}
else
{
	$userQuery = "SELECT username, version, current_study_id, isAdmin FROM users WHERE USER_ID = '$userid'";
}

$result = $db->query($userQuery);

if($result)
{
	$length = mysqli_num_rows($result);
	for($i = 0; $i < $length; $i++)
	{
		$row = mysqli_fetch_assoc($result);
		echo $row['username'].",";
		echo $row['version'].",";
		echo $row['current_study_id'].",";
		echo $row['isAdmin'].";";
	}
}

else
{
	echo "Error";
}

$db->close();
die;
?>
