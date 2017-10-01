# Tic-Tac-Toe
A simple tic-tac-toe game operating on a single page and playable in the
browser.
Users are able to register new accounts and authenticate using
email and password pairs. Once authenticated, users can change their
passwords, start new games, load existing games, view a history of their
finished games, and view stats for how many wins, losses, and ties they
have had.

## Technologies-Used
Styling was done with HTML and CSS/Sass. The game engine was built with
JavaScript. DOM manipulation was achieved with jQuery. AJAX was used
for all HTTP requests to and from a 3rd party API.

## Planning
I used wireframes to hash out some early design decisions. I wrote a few
user stories to help organize the different features I had planned for
the game. I did some whiteboarding to help visualize how I would represent
the game board programatically.

## Development-and-Problem-Solving
Throughout the project, I tried to break down every objective into steps.
A good example of this is visually displaying gameplay history to my
users. I knew that the API I was using supported a GET request that pulled
all of the games a given user had finished playing. I also knew that I
could use a technique that I had already used in the program to determine
whether or not a game had been won or tied. From there, it would be a
simple matter of extending this function to determine who the winner was
by comparing the winning piece (X or O) to the piece the given user was
playing with during that game. With all of this knowledge, I could display
wins, losses, and ties to the user in the form of a scrollable div.

## Future-Versions
In the future, I would like to implement a multi-player online version of
the game. I would like to make the game a true SPA by supporting
deep-linking, native browser nav, and a better system for dynamic
structure and style display instead of hiding and showing existing
elements of the webpage.

## User-Stories-and-Wireframes
https://docs.google.com/document/d/1OTJuDP5QIo-VbowHuvsAM3JnMhTYcFn5wyU_w-Twtyc/edit?usp=sharing
