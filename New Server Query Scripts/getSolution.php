<?php

include('config.php');
include('connect.php');

$userid = $_POST['userid'];
$puzzle = $_POST['puzzle'];

$query = "SELECT Solution from puzzle_scores where USER_ID = '$userid' AND PUZZLE_ID = '$puzzle' ORDER BY isComplete DESC, timestamp DESC LIMIT 0,1;";
$result = $db->query($query);

if($result)
  {
	$row = $result->fetch_assoc();
	echo $row['Solution'];
  }
else
	echo "Error!";

$db->close();
?>


