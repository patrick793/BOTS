<?php

  include('config.php');
  include('connect.php');

  $user = $_POST['user'];
  $puzzleid = $_POST['PUZZLE_ID'];
  $score = $_POST['score'];
  
  $scoreQuery1 = "SELECT * FROM Score WHERE (PUZZLE_ID = '$puzzleid' AND username = '$user') ORDER BY score ASC";
  $result1 = $db->query($scoreQuery1);
  if($result1)
  {
     $row1 = mysqli_fetch_assoc($result1);
     $tempscore = $row1['score']; 
     if($tempscore < $score)
     {
         $scoreQuery2 = "UPDATE Score SET isTop = 0 WHERE (PUZZLE_ID = '$puzzleid' AND username = '$user')";
         $result2 = $db->query($scoreQuery2);
         if($result2)
         {
              $scoreQuery3 = "INSERT INTO Score(username, PUZZLE_ID, score, isTop) VALUES('$user', '$puzzleid', '$score', 1)";
              $result3 = $db->query($scoreQuery3);
              die;
         }
     }
   
     else if($tempscore > $score)
     {
         $scoreQuery4 = "INSERT INTO Score(username, PUZZLE_ID, score, isTop) VALUES('$user', '$puzzleid', '$score', 0)";
         $result4 = $db->query($scoreQuery4);
         die;

     }
     else
     {
         echo "Error";
     }

  } 
  
  else
  {
      $scoreQuery = "INSERT INTO Score(username, PUZZLE_ID, score, isTop) VALUES('$user', '$puzzleid', '$score', 1)";
      $result = $db->query($scoreQuery);

      if($result)
      {
          die;
      }

      else
      {
          echo "Error";
      }

  }
	$lastQuery1 = "UPDATE Levels SET published = 1 WHERE PUZZLE_ID = '$puzzleid';
?>