<?php

include('config.php');
include('connect.php');

$userid = $_GET['userid'];
$token = $_GET['token'];

$version = $_GET['version'];

$addendum = "";
if ($version != 0)
$addendum = " AND puzzles.version = $version ";

$db->query('SET SQL_BIG_SELECTS=1'); 

if($token == "friends")
{
	$puzzleQuery = "SELECT puzzles.user as author, puzzles.PUZZLE_ID, puzzle, hiscore, myhiscore, champ, published, rating, version, description FROM puzzles
	LEFT JOIN (
	SELECT PUZZLE_ID, AVG(rating) AS rating from puzzle_ratings where USER_ID != $userid GROUP BY PUZZLE_ID
	) as ratings ON puzzles.PUZZLE_ID = ratings.PUZZLE_ID

	LEFT JOIN (
	Select PUZZLE_ID, Min(score) AS myhiscore from puzzle_scores where USER_ID = $userid AND isComplete = 1 GROUP BY PUZZLE_ID) AS B ON puzzles.PUZZLE_ID = B.PUZZLE_ID

	LEFT JOIN (
	SELECT min.username as champ, min.PUZZLE_ID, hiscore FROM puzzle_scores, 
	(SELECT username, PUZZLE_ID, MIN(score) as hiscore FROM puzzle_scores WHERE isComplete = 1 GROUP BY PUZZLE_ID) as min WHERE isComplete = 1) as C ON puzzles.PUZZLE_ID = C.PUZZLE_ID

	WHERE puzzles.USER_ID != $userid
	" . $addendum . "
	AND puzzles.published = 1
	GROUP BY puzzles.PUZZLE_ID;";
}
else if($token == "my")
{
	$puzzleQuery = "SELECT puzzles.user as author, puzzles.PUZZLE_ID, puzzle, hiscore, myhiscore, champ, published, rating, version, description FROM puzzles
	LEFT JOIN (
	SELECT PUZZLE_ID, AVG(rating) AS rating from puzzle_ratings where USER_ID != $userid GROUP BY PUZZLE_ID
	) as ratings ON puzzles.PUZZLE_ID = ratings.PUZZLE_ID

	LEFT JOIN (
	Select PUZZLE_ID, Min(score) AS myhiscore from puzzle_scores where USER_ID = $userid AND isComplete = 1 GROUP BY PUZZLE_ID) AS B ON puzzles.PUZZLE_ID = B.PUZZLE_ID

	LEFT JOIN (
	SELECT min.username as champ, min.PUZZLE_ID, hiscore FROM puzzle_scores, 
	(SELECT username, PUZZLE_ID, MIN(score) as hiscore FROM puzzle_scores WHERE isComplete = 1 GROUP BY PUZZLE_ID) as min WHERE isComplete = 1) as C ON puzzles.PUZZLE_ID = C.PUZZLE_ID

	WHERE puzzles.USER_ID = $userid
	" . $addendum . "
	GROUP BY puzzles.PUZZLE_ID;";
}
$result = $db->query($puzzleQuery);

if($result)
{
	$length = mysqli_num_rows($result);
	for($i = 0; $i < $length; $i++)
	{
		$row = mysqli_fetch_assoc($result);
		echo $row['author'].",";
		echo $row['puzzle'].",";
		echo $row['PUZZLE_ID'].",";
		echo $row['myhiscore'].",";
		echo $row['hiscore'].",";
		echo $row['champ'].",";
		echo $row['published'].",";
		echo "0".$row['rating'].",";
		echo $row['version'].",";
		echo $row['description'].";";
	}     
}
else
{
	echo "Error with query: \n";
	echo $puzzleQuery . "\n";
	echo $db->errno . ": " . $db->error . "\n";
}

$db->close();
die;
?>