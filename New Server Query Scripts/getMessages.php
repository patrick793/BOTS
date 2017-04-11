<?php

include('config.php');
include('connect.php');

$userid = $_GET['userid'];

$messageQuery = "SELECT MESSAGE_ID, sender, message, PUZZLE_ID, timestamp, viewed FROM messages WHERE deleted = 0 AND USER_ID = '$userid'";
$result = $db->query($messageQuery);

if($result)
{
	$length = mysqli_num_rows($result);
	for($i = 0; $i < $length; $i++)
	{
		$row = mysqli_fetch_assoc($result);
		echo $row['MESSAGE_ID'].",";
		echo $row['sender'].",";
		echo $row['message'].",";
		echo $row['PUZZLE_ID'].",";
		echo $row['timestamp'].",";
		echo $row['viewed'].";";
	}
}

else
{
	echo "Error";
}

$db->close();
die;
?>
