<?php

  include('config.php');
  include('connect.php');

  $user = $_GET['user'];

  $puzzleQuery = "SELECT user, puzzle, PUZZLE_ID FROM Levels WHERE (user in (SELECT friendname FROM Friends WHERE (username = '$user' AND getLevels = 1)) AND published = 1) OR (user = 'BOTS')";
  $result = $db->query($puzzleQuery);

  if($result)
  {
      $length = mysqli_num_rows($result);
      for($i = 0; $i < $length - 1; $i++)
      {
          $row = mysqli_fetch_assoc($result);
          echo $row['user'].",";
          echo $row['puzzle'].",";
          echo $row['PUZZLE_ID'].";";
      }

      $row = mysqli_fetch_assoc($result);
      echo $row['user'].",";
      echo $row['puzzle'].",";
      echo $row['PUZZLE_ID'];


      die;
  }

  else
  {
    echo "Error $db->error";
  }


?>
