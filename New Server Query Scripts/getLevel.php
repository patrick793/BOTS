<?php

include('config.php');
include('connect.php');
$filename = $_GET['file'];

chdir("../../botsFiles/Levels");

$entire_file = file_get_contents($filename);
echo($entire_file);

$db->close();

?>


