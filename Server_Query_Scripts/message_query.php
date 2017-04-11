<?php

  include('config.php');
  include('connect.php');

  $user = $_GET['user'];

  $messageQuery = "SELECT username, sender, message FROM Message WHERE view = 1 AND username = '$user'";
  $result = $db->query($messageQuery);


  if($result)
  {
       $length = mysqli_num_rows($result);
      for($i = 0; $i < $length - 1; $i++)
      {
          $row = mysqli_fetch_assoc($result);
          echo $row['username'].",";
          echo $row['sender'].",";
          echo $row['message'].",";

      }

      $row = mysqli_fetch_assoc($result);
      echo $row['username'].",";
      echo $row['sender'].",";
      echo $row['message'];
      
      die;
  }

  else
  {
    echo "Error";
  }


?>
