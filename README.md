Simple JavaScript and HTML5 browser game.
Just click on index.html to run it.

Here is a link to the live version:
http://karoldavid.github.io/arcade-game/

How the Game Works
------------------

Enemies: 3 bugs
Player: 1 (may be changed to boy, cat, horn, pink, or princess)
Gems: Blue, Green, Orange, Heart, Key, Rock, Selector, Star
Goal: water
Game Over: Collision with Bug/ Rock or Time Out
Timer: start at 0
Time Out: time count reaches 300

Press cursor-keys to moves the player into one of the four directions.
Press Enter to change between five  different players (boy, cat,
horn, pink, and princess)

To stay in the game, the player has to cross the board and reach the water.
If the timer count is equal to 300 or the player runs into a bug or a stone,
the game is over and restarts immediately.

The bugs are crossing the board with different speed from left to the right.
The stone is appearing from time to time.

The timer is always running so that the player is under constant pressure
to take action and make decisions with suboptimal information. The sooner
the player reaches the water the less points he looses (depending on the
timer count).

The player always restarts from the initial position and the timer always
(re-) starts from 0. The player keeps his points as long as he does not run into
a bug or a stone or the timer count reaches 300. The minimum score is 0.

The player can collect randomly appearing gems and multiply their value by 10
if he shuffles to the appropriate player (Blue = boy, Green = cat,
Orange = horn, Heart = pink, Star = princess).

On the top right of the board the player gets a hint if it is a good time
to shuffle the player or to move.

Score
-----
Reach Water: 100
Timer Count: - timer count * 10
Gem Value: Blue = 10, Green = 20, Orange = 30, Heart = 40, Key = 100,
           Rock = 0, Selector = 5, Star = 50
Gem Value * 10: Blue = boy, Green = cat, Orange = horn,
                Heart = pink, Star = princess

Minimum player score is 0.
