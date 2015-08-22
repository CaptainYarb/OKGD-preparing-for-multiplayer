# OKGD-preparing-for-multiplayer
[Aug 6th Presentation for Oklahoma Game Developers meetup](http://www.meetup.com/Oklahoma-Game-Developers/events/224288063/).a# OKGD-preparing-for-multiplayer
[Aug 6th Presentation for Oklahoma Game Developers meetup](http://www.meetup.com/Oklahoma-Game-Developers/events/224288063/).

The included files are seperated into two parts: demos and slides.


Running the Slides
==================
All you need to view the slides is a web server. A simple app like [Fenix Web Server](http://fenixwebserver.com/) will host the files where they are viewable. Running at the local file:// works with a few minor quirks.

Running the Demos
=================
You need nw.js and node installed for the client and server respectively. The code was tested and runs on Node.js 0.12.7. Be sure to run `npm install` on both the client and server before running.

Known Issues
------------
The UDP client test does not unbind the socket which may present ADDRESS_IN_USE errors.
