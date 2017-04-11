<?php

  include('config.php');
  include('connect.php');

  $user = $_GET['user'];
  $puzzle = $_GET['puzzle'];

  $publishQuery = "UPDATE Levels SET published = 1 WHERE (user = '$user' AND puzzle = '$puzzle')";
  $result = $db->query($publishQuery);

  if($result)
  {
      die;
  }

  else
  {
    echo "Error $db->error";
  }


?>
