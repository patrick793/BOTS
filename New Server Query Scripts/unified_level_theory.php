<?php

  include('config.php');
  include('connect.php');

  $user = $_GET['user'];
  $token = $_GET['token'];

  if($token == "friends")
  {
  $puzzleQuery = "SELECT * FROM 
  (SELECT username as champ, min.PUZZLE_ID, hiscore
FROM puzzle_scores,
  (SELECT PUZZLE_ID, MIN(score) as hiscore
  FROM puzzle_scores
  GROUP BY PUZZLE_ID) as min
WHERE min.PUZZLE_ID=puzzle_scores.PUZZLE_ID 
AND min.hiscore=puzzle_scores.score
GROUP BY puzzle_scores.PUZZLE_ID
ORDER BY PUZZLE_ID,timestamp ASC) as f 
  RIGHT OUTER JOIN 
  (SELECT * FROM 
	(SELECT PUZZLE_ID as pid, min(score) as myhiscore from puzzle_scores WHERE username = '$user' GROUP BY pid) as x 
	RIGHT OUTER JOIN 
	(SELECT PUZZLE_ID, puzzle, user as author, published FROM puzzles WHERE published = 1) 
	as y ON x.pid = y.PUZZLE_ID ) 
   as g ON f.PUZZLE_ID = g.PUZZLE_ID WHERE author != '$user';";
   }
   else if($token == "my")
   {
	$puzzleQuery = "SELECT * FROM 
  (SELECT username as champ, min.PUZZLE_ID, hiscore
FROM puzzle_scores,
  (SELECT PUZZLE_ID, MIN(score) as hiscore
  FROM puzzle_scores
  GROUP BY PUZZLE_ID) as min
WHERE min.PUZZLE_ID=puzzle_scores.PUZZLE_ID 
AND min.hiscore=puzzle_scores.score
GROUP BY puzzle_scores.PUZZLE_ID
ORDER BY PUZZLE_ID,timestamp ASC) as f 
  RIGHT OUTER JOIN 
  (SELECT * FROM 
	(SELECT PUZZLE_ID as pid, min(score) as myhiscore from puzzle_scores WHERE username = '$user' GROUP BY pid) as x 
	RIGHT OUTER JOIN 
	(SELECT PUZZLE_ID, puzzle, user as author, published FROM puzzles ) 
	as y ON x.pid = y.PUZZLE_ID ) 
   as g ON f.PUZZLE_ID = g.PUZZLE_ID WHERE author = '$user' ORDER BY published DESC;";
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
		  echo $row['published'].";";
      }     
      die;
  }

  else
  {
    echo "Error";
  }

$db->close();
?>