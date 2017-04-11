<?php

  include('config.php');
  include('connect.php');

  $puzzleid = $_GET['PUZZLE_ID'];

  $puzzleQuery = "SELECT user, puzzle FROM Levels WHERE PUZZLE_ID = '$puzzleid'";
  $result = $db->query($puzzleQuery);

  if($result)
  {
      $length = mysqli_num_rows($result);
      for($i = 0; $i < $length - 1; $i++)
      {
          $row = mysqli_fetch_assoc($result);
          echo $dbserver + "/drupal-6.2/botsFiles/Levels/";
          echo $row['user']."-";
          echo $row['puzzle'].".xml;";
      }

      $row = mysqli_fetch_assoc($result);
      echo $dbserver + "/drupal-6.2/botsFiles/Levels/";
      echo $row['user']."-";
      echo $row['puzzle'].".xml;";


      die;
  }

  else
  {
    echo "Error $db->error";
  }


?>
