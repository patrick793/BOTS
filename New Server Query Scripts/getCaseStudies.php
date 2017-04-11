<?php

include('config.php');
include('connect.php');

//$userid = $db->real_escape_string($_GET['userid']);

$userQuery = "SELECT STUDY_ID, study_name, Active, version_1, version_2, version_3 FROM studies";
$result = $db->query($userQuery);

if($result)
{
	$length = mysqli_num_rows($result);
	for($i = 0; $i < $length; $i++)
	{
		$row = mysqli_fetch_assoc($result);
		echo $row['STUDY_ID'].",";
		echo $row['study_name'].",";
		echo $row['Active'].",";
		echo $row['version_1'].",";
		echo $row['version_2'].",";
		echo $row['version_3'].";";
	}
}

else
{
	echo "Error";
}

$db->close();
die;
?>
