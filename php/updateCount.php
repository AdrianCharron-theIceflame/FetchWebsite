<?php
//Open the file. Note that it is in the subfolder files
$dataFile="../files/players.json";

$post_rec = file_get_contents("php://input") or die("Error: Cannot get file input post");

$json_file = file_get_contents($dataFile) or die("Error: Cannot get file of players");

$json_array = json_decode($json_file);
$json_rec = json_decode($post_rec);

foreach ($json_array as $curr_rec) {
	if ($json_rec->id === $curr_rec->id) {
		$curr_rec->wins = $json_rec->wins;
		$curr_rec->losses = $json_rec->losses;
		// $curr_rec = $json_rec;
	}
}

$out_string = json_encode($json_array, JSON_PRETTY_PRINT+JSON_UNESCAPED_SLASHES);
$bytes = file_put_contents($dataFile,$out_string);

if ($bytes>0) {
	echo "Successful update";
} else {
	echo "Update failed";
}

?>