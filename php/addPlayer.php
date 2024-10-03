<?php
//Open the file. Note that it is in the subfolder files
$dataFile="../files/players.json";

$post_rec = file_get_contents("php://input") or die("Error: Cannot get file input post");

$json_file = file_get_contents($dataFile) or die("Error: Cannot get file of players");

$json_array = json_decode($json_file);

$json_rec = json_decode($post_rec);

array_push($json_array, $json_rec);

$out_str = json_encode($json_array, JSON_PRETTY_PRINT+JSON_UNESCAPED_SLASHES);

$bytes = file_put_contents($dataFile,$out_str);

if ($bytes>0) {
	echo "Successful add";
} else {
	echo "Update failed";
}
?>