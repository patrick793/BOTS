<?php
if (isset ($_GET['username']))
{
	$username= $_GET['username'];
	
}
else
{
	die("the username was not passed");
}


include("config.php"); 
include("connect.php");

$query = "SELECT * FROM `achievements_earned`
WHERE username='$username'";
$result=$db->query($query);
if($result)
{
	while($row = $result->fetch_assoc())
	{
		//echo intval($row['achievements_Id']);
		$achievements[intval($row['achievements_Id'])] = true;
	}
}	
else 
{
	echo("error getting prnting the query $db->error");
}




  
 
 
/* Check for productive achievement 16*/
if(isset($achievements[16]))
{
	echo "$username already earned achivement 16";
}
else
{
	achievement_beatCreator($username, $db, 16);
	/* Check for productive achievement 15*/
	if(isset($achievements[15]))
	{
		echo "$username already earned achievement 15";	
	}
	else
	{
		achievement_beatCreator($username, $db, 15);
		/* Check for productive achievement 14*/
		if(isset($achievements[14]))
		{
			echo "$username already earned achievement 14";
		}
		else
		{
			achievement_beatCreator($username, $db, 14);
			/* Check for productive achievement 13*/
			if(isset($achievements[13]))
			{
				echo "$username already earned achievement 13";
			}
			else
			{
				achievement_beatCreator($username, $db, 13);
			}
		}	
	}
}	


/* Check for productive achievement 12*/
if(isset($achievements[12]))
{
	echo "$username already earned achievement 12";	
}
else
{
	achievement_bestLevels($username, $db, 12);
	/* Check for productive achievement 11*/
	if(isset($achievements[11]))
	{
			echo "$username already earned achievement 11";
	}
	else
	{
		achievement_bestLevels($username, $db, 11);
		/* Check for productive achievement 10 */
		if(isset($achievements[10]))
		{
			echo "$username already earned achievement 10";
		}
		else
		{
			achievement_bestLevels($username, $db, 10);
			/* Check for productive achievement 9 */
			if(isset($achievements[9]))
			{
				echo "$username already earned achievement 9 ";	
			}
			else
			{
				achievement_bestLevels($username, $db, 9);
			}
		}
	}
}	


/* Check for productive achievement 8 */
if(isset($achievements[8]) )
{
	echo "$username already earned achievement 8";
}
else 
{
	achievement_makeLevels($username, $db, 8);
	/* Check for productive achievement 7 */
	if(isset($achievements[7]) )
	{
		echo "$username already earned achievement 7";
	}
	else 
	{
		achievement_makeLevels($username, $db, 7);
		/* Check for productive achievement 6 */
		if(isset($achievements[6]) )
		{
			echo "$username already earned achievement6";		
		}
		else 
		{
			achievement_makeLevels($username, $db, 6);
			/* Check for productive achievement 5 */
			if(isset($achievements[5]) )
			{
				echo "$username already earned achievement 5";				
			}
			else 
			{
				achievement_makeLevels($username, $db, 5);
			}
		}
	}
}	


/* Check for productive achievement 4*/
if(isset($achievemens[4]))
{
	echo"$username already earned achievement 4";
}
else
{
	achievement_mostPlayedLevels($username, $db, 4);
	/* Check for productive achievement 3*/
	if(isset($acheivemets[3]))
	{
		echo "$username already earned achievement 3";
	}
	else
	{
		achievement_mostPlayedLevels($username, $db, 3);
		/* Check for productive achievement 2*/
		if(isset($acheivements[2]))
		{
			echo "$username already earned achievement 2"; 
		}
		else
		{
			achievement_mostPlayedLevels($username, $db, 2);
			/* Check for productive achievement 1*/
			if(isset($achievements[1]))
			{
				echo "$username already earned achievement 1"; 
			}
			else
			{
				achievement_mostPlayedLevels($username, $db, 1);
			}
		}											
	}																				
}
$db->close();

	
function achievement_mostPlayedLevels($username, $db, $ach_id)
{
	//This function checks to see the number of users that have played a creator's level and grants them the appropriate achievements.
	$ach_value;
	switch($ach_id)
	{
		case 1:
			$ach_value = 5;
			break;
		case 2:
			$ach_value = 10;
			break;
		case 3:
			$ach_value = 25;
			break;
		case 4:
			$ach_value = 50;
			break;
		default:
			return;
	}
	
	$query="SELECT bear.username, puzzles.PUZZLE_ID, count(*) as count
FROM puzzles, (SELECT * FROM `puzzle_scores` WHERE username!='$username') as bear
WHERE user='$username' AND 
puzzles.PUZZLE_ID=bear.PUZZLE_ID ";
	
	$result=$db->query($query);
	if($result)
	{
		$row = $result->fetch_assoc();
	}	
	else 
	{
		echo("error getting prnting the query $db->error");
	}
	
	
	if(intval($row['count'])>= $ach_value)
	{
		$query = "INSERT IGNORE INTO achievements_earned (achievements_Id, username)
					VALUES ('$ach_id', '$username')";
		$result=$db->query($query);
		if($result)
		{
			/* Achievement earned */
			echo " achievement $ach_id was earned,";
		}
		else 
		{
			echo "Error inserting achivement $db->error";
		}
	}
	else 
	{
		//Do nothing achievement wasnt earned
		echo " "."Achievement"." "." $ach_id was not earned,"."\n";
	}
	
}



function achievement_makeLevels($username, $db, $ach_id)
{
	//This function checks to see the number of levels a user has made and grants them the appropriate achievements.
	$ach_value;
	switch($ach_id)
	{
		case 5:
			$ach_value = 5;
			break;
		case 6:
			$ach_value = 10;
			break;
		case 7:
			$ach_value = 25;
			break;
		case 8:
			$ach_value = 50;
			break;
		default:
			return;
	}
	
	$query="SELECT * 
		FROM(SELECT user, published, count(*) as count
		FROM puzzles
		WHERE published=1 AND user='$username'
		GROUP BY user, published)as bear
		LIMIT 0,1";
	
	$result=$db->query($query);
	if($result)
	{
		$row = $result->fetch_assoc();
	}	
	else 
	{
		echo("error getting prnting the query $db->error");
	}
	
	
	if(intval($row['count'])>= $ach_value)
	{
		$query = "INSERT IGNORE INTO achievements_earned (achievements_Id, username)
					VALUES ('$ach_id', '$username')";
		$result=$db->query($query);
		if($result)
		{
			/* Achievement earned */
			echo " achievement $ach_id was earned,";
		}
		else 
		{
			echo "Error inserting achivement $db->error";
		}
	}
	else 
	{
		//Do nothing achievement wasnt earned
		echo " "."Achievement"." "." $ach_id was not earned,"."\n";
	}
}



function achievement_bestLevels($username, $db, $ach_id)
{

//This function checks to see the five higest score and grants them the appropriate achievements.
	$ach_value;
	switch($ach_id)
	{
		case 9:
			$ach_value = 5;
			break;
		case 10:
			$ach_value = 10;
			break;
		case 11:
			$ach_value = 25;
			break;
		case 12:
			$ach_value = 50;
			break;
		default:
			return;
	}
	
	$query="SELECT DISTINCT puzzle_scores.PUZZLE_ID, count(*) as count FROM `puzzle_scores`, 
    (SELECT MIN(score) as HiScore, PUZZLE_ID 
    from puzzle_scores
    WHERE score > 0
    GROUP BY PUZZLE_ID) as Target 
WHERE 
username = '$username' AND
puzzle_scores.score = Target.HiScore AND 
puzzle_scores.PUZZLE_ID = Target.PUZZLE_ID 
ORDER BY puzzle_scores.PUZZLE_ID ASC";
	
	$result=$db->query($query);
	if($result)
	{
		$row = $result->fetch_assoc();
	}	
	else 
	{
		echo("error getting prnting the query $db->error");
	}
	
	// the count does
	if(intval($row['count'])>= $ach_value)
	{
		$query = "INSERT IGNORE INTO achievements_earned (achievements_Id, username)
					VALUES ('$ach_id', '$username')";
		$result=$db->query($query);
		if($result)
		{
			/* Achievement earned */
			echo "$achievement $ach_id was earned,";
		}
		else 
		{
			echo "Error inserting achivement $db->error";
		}
	}
	else 
	{
		//Do nothing achievement wasnt earned
		echo " "."Achievement"." "." $ach_id was not earned,"."\n";
	}	
	
	
}



function achievement_beatCreator($username, $db, $ach_id)
{
	//This function checks to see if the player has beaten the creator's level and grants them the appropriate achievements.
	$ach_value;
	switch($ach_id)
	{
		case 13:
			$ach_value = 5;
			break;
		case 14:
			$ach_value = 10;
			break;
		case 15:
			$ach_value = 25;
			break;
		case 16:
			$ach_value = 50;
			break;
		default:
			return;
	}
	
	$query="Select count(*) as count from puzzle_scores, 
      (Select puzzles.PUZZLE_ID, puzzles.user as author, MIN(score) as creator_score from puzzles, puzzle_scores  
      WHERE puzzles.user = puzzle_scores.username 
      AND puzzles.PUZZLE_ID = puzzle_scores.PUZZLE_ID
      GROUP BY puzzles.PUZZLE_ID) as creator_scores 
WHERE
username = '$username' AND 
puzzle_scores.score < creator_scores.creator_score AND
username != author AND
puzzle_scores.PUZZLE_ID = creator_scores.PUZZLE_ID";
	
	$result=$db->query($query);
	if($result)
	{
		$row = $result->fetch_assoc();
	}	
	else 
	{
		echo("error getting prnting the query $db->error");
	}
	
	
	if(intval($row['count'])>= $ach_value)
	{
		$query = "INSERT IGNORE INTO achievements_earned (achievements_Id, username)
					VALUES ('$ach_id', '$username')";
		$result=$db->query($query);
		if($result)
		{
			/* Achievement earned */
			echo " achievement $ach_id was earned,";
		}
		else 
		{
			echo "Error inserting achivement $db->error";
		}
	}
	else 
	{
		//Do nothing achievement wasnt earned
		echo " "."Achievement"." "." $ach_id was not earned,"."\n";
	}
}

?>