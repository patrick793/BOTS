<?php

if (isset ($_GET['userid']))
{
	$userid= $_GET['userid'];
}
else
{
	die("the username was not passed");
}


include("config.php"); 
include("connect.php");

$query="select * from achievements, achievements_earned 
where achievements.ACH_ID = achievements_earned.ACH_ID
and achievements_earned.USER_ID = $userid";
$result=$db->query($query);

if($result)
{
	while($row=$result->fetch_assoc())
	{
		print($row['ACH_ID'] . "," . $row['name'] ."," . $row['description'] . "," . $row['value'] . ";");		 
	}
}


$db->close();
?>
