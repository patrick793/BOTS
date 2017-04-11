<?php

  include('config.php');
  include('connect.php');

  $user = $_GET['user'];
  
  $friendQuery = "SELECT friendname FROM Friends WHERE username = '$user'";
  $result = $db->query($friendQuery);

  if($result)
  {
       $length = mysqli_num_rows($result);
      for($i = 0; $i < $length - 1; $i++)
      {
          $row = mysqli_fetch_assoc($result);
          echo $row['friendname'].",";
      }

      $row = mysqli_fetch_assoc($result);
      echo $row['friendname'];

      die;
  }

  else
  {
    echo "Error";
  }


?>
