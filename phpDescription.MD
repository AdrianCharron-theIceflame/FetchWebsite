Using PHP Programs

addPlayer.php
- send a post request with a complete player record
- the PHP program does no error checking
- the record will be added to the end of the players.json file
- it is up to you to ensure that the id is unique
- the program returns the string "Successful add" if the record was added
- anything other than that and the record was not added

updateCount.php
- send a post request with a complete player record (although it will not all be used)
- the PHP program does no error checking
- the PHP program goes through all the players in players.json
    - for each record in players.json where the id matches the id of the posted record
        - the wins and losses of the player matched is updated with the wins and losses from the posted record
- the players.json file is updated with the new information
- the program returns the string "Successful update" if the record was update OR IF THERE WAS NO MATCHING RECORD
    - the program does NOT catch the fact that the id does not match
- anything other than that return and the record was not updated
