<?php

  include('config.php');
  include('connect.php');

  $puzzle = $_GET['puzzle'];

  $scoreQuery = "SELECT username, puzzle, score FROM Score WHERE puzzle = '$puzzle' ORDER BY score ASC LIMIT 0, 10";
  $result = $db->query($scoreQuery);

  if($result)
  {
       $length = mysqli_num_rows($result);
      for($i = 0; $i < $length - 1; $i++)
      {
          $row = mysqli_fetch_assoc($result);
          echo $row['username'].",";
          echo $row['puzzle'].",";
          echo $row['score'].",";

      }

      $row = mysqli_fetch_assoc($result);
      echo $row['username'].",";
      echo $row['puzzle'].",";
      echo $row['score'];

      die;
  }

  else
  {
    echo "Error";
  }


?>
