<?php

  include('config.php');
  include('connect.php');

//localhost/scripts/addRating.php?user=admin&puzzle=945780&stars=4

$userid = $_GET['userid'];
$puzzleid = $_GET['puzzleid'];
$stars = $_GET['stars'];

$query = "INSERT INTO puzzle_ratings (USER_ID, PUZZLE_ID, rating) VALUES ($userid, $puzzleid, $stars);";

if(isset($_GET['userid']) &&
isset($_GET['puzzleid']) &&
isset($_GET['stars']))
{
$db->query($query);
}
else
{
	die("Incomplete values passed in.");
}

$db->close();
?>
