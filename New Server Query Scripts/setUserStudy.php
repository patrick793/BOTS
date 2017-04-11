<?php

include('config.php');
include('connect.php');

$userid = $db->real_escape_string($_GET['userid']);
$studyid = $db->real_escape_string($_GET['studyid']);

$oldStudyid;
$oldVersionNum;

$newVersionNum;


if ($userid == null or $studyid == null)
{
	echo "Argument error";
	die;
}

$userQuery = "SELECT current_study_id, version FROM users WHERE  USER_ID = '$userid'";
$result = $db->query($userQuery);

if($result)
{
	$row = mysqli_fetch_assoc($result);
	$oldStudyid = $row["current_study_id"];
	$oldVersionNum = $row["version"];
	
	if ($oldStudyid != '0')
	{
		$userQuery = "UPDATE studies SET version_$oldVersionNum = version_$oldVersionNum - 1 WHERE STUDY_ID = '$oldStudyid'";
		$result = $db->query($userQuery);
		
		if($result)
		{
			//echo "Updated Old study,";
		}
		else
		{
			echo "Error Updating Old study,";
			$db->close();
			die;
			
		}
	}
	
	$userQuery = "SELECT last_joined_version FROM studies WHERE STUDY_ID = '$studyid'";
	$result = $db->query($userQuery);
	if($result)
	{
		$row = mysqli_fetch_assoc($result);
		$lastVersionNum = $row["last_joined_version"];
		
		if ($lastVersionNum == '3')
			$newVersionNum = 1;
		else if ($lastVersionNum == '1')
			$newVersionNum = 2;
		else if ($lastVersionNum == '2')
			$newVersionNum = 3;
		
		$userQuery = "UPDATE studies SET version_$newVersionNum = version_$newVersionNum + 1, last_joined_version = '$newVersionNum' WHERE STUDY_ID = '$studyid'";
		$result = $db->query($userQuery);
		if($result)
		{
			//echo "Updated new study,";
			
			$userQuery = "UPDATE users SET current_study_id = '$studyid', version = '$newVersionNum' WHERE  USER_ID = '$userid'";
			$result = $db->query($userQuery);
			if($result)
			{
				//echo "Updated user,";
			}

			else
			{
				echo "Error updating user";
				$db->close();
				die;
			}		
		}
		else
		{
			echo "Error updating new study,";
			$db->close();
			die;
		}		
	}
	else
	{
		echo "Error Getting next version number to assign,";
		$db->close();
		die;
	}
	

	
	
	echo "Success";
}
else
{
	echo "Error getting old user info";
}

$db->close();
die;
?>
